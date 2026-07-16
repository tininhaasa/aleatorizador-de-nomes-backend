// ============================================================
// 📚 CONCEITO: Lógica de negócio — "fila de rodadas", agora por turma
//
// Cada turma tem sua própria coluna `ciclo_atual` (em vez de um
// contador global). Toda a lógica abaixo é idêntica à versão
// anterior, mas SEMPRE filtrando por turma_id — assim a turma do
// 2ºA e a do 3ºB têm filas e históricos totalmente independentes.
//
// Regra:
//   ja_sorteado_ciclo = false → elegível nesta rodada
//   ja_sorteado_ciclo = true  → já foi sorteado, fica de fora até a próxima rodada
//
// Quando sobram menos de 2 elegíveis na turma, reiniciamos o ciclo
// DAQUELA turma: zera a flag de todos os alunos ativos dela e
// incrementa turmas.ciclo_atual.
//
// Ausências do dia não alteram ja_sorteado_ciclo — o aluno ausente
// simplesmente não participa do sorteio daquele dia, sem perder a vez.
//
// Tudo roda dentro de uma TRANSAÇÃO (BEGIN/COMMIT/ROLLBACK).
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Escolhe N itens aleatórios e distintos de um array
function escolherAleatorios(lista, quantidade) {
  const copia = [...lista];
  const escolhidos = [];

  while (escolhidos.length < quantidade && copia.length > 0) {
    const indice = Math.floor(Math.random() * copia.length);
    escolhidos.push(copia[indice]);
    copia.splice(indice, 1);
  }

  return escolhidos;
}

// ── GET /api/sorteio/:turmaId/status ─────────────────────────
router.get('/:turmaId/status', async (req, res) => {
  try {
    const { turmaId } = req.params;

    const turma = await pool.query('SELECT ciclo_atual FROM turmas WHERE id = $1', [turmaId]);
    if (turma.rows.length === 0) {
      return res.status(404).json({ erro: 'Turma não encontrada' });
    }

    const alunos = await pool.query(
      'SELECT id, nome, ja_sorteado_ciclo FROM alunos WHERE turma_id = $1 AND ativo = true ORDER BY nome',
      [turmaId]
    );

    res.json({
      ciclo_atual: turma.rows[0].ciclo_atual,
      alunos: alunos.rows,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar status' });
  }
});

// ── GET /api/sorteio/:turmaId/historico ───────────────────────
router.get('/:turmaId/historico', async (req, res) => {
  try {
    const { turmaId } = req.params;

    const resultado = await pool.query(
      `SELECT s.id, s.ciclo, s.data_sorteio, a.nome AS aluno_nome
       FROM sorteios s
       JOIN alunos a ON a.id = s.aluno_id
       WHERE s.turma_id = $1
       ORDER BY s.data_sorteio DESC
       LIMIT 100`,
      [turmaId]
    );
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar histórico' });
  }
});

// ── POST /api/sorteio/:turmaId/sortear ────────────────────────
// Body esperado: { "ausentes": [3, 7] }  (IDs dos alunos ausentes hoje)
router.post('/:turmaId/sortear', async (req, res) => {
  const { turmaId } = req.params;
  const ausentes = Array.isArray(req.body.ausentes) ? req.body.ausentes : [];
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');

    const turmaResult = await cliente.query(
      'SELECT id, ciclo_atual FROM turmas WHERE id = $1 FOR UPDATE',
      [turmaId]
    );
    if (turmaResult.rows.length === 0) {
      await cliente.query('ROLLBACK');
      return res.status(404).json({ erro: 'Turma não encontrada' });
    }

    // 1) Quem está ativo e presente hoje, NESTA turma?
    const presentesResult = await cliente.query(
      `SELECT id, nome, ja_sorteado_ciclo
       FROM alunos
       WHERE turma_id = $1
         AND ativo = true
         AND id <> ALL($2::int[])`,
      [turmaId, ausentes]
    );
    const presentes = presentesResult.rows;

    if (presentes.length < 2) {
      await cliente.query('ROLLBACK');
      return res.status(400).json({
        erro: 'É necessário ao menos 2 alunos ativos e presentes nesta turma para sortear.'
      });
    }

    // 2) Pool de elegíveis: presentes que ainda não foram sorteados neste ciclo
    let elegiveis = presentes.filter(a => !a.ja_sorteado_ciclo);
    let cicloReiniciado = false;
    let cicloAtual = turmaResult.rows[0].ciclo_atual;

    // 3) Se a rodada está esgotada (menos de 2 elegíveis), reinicia o ciclo DESTA turma
    if (elegiveis.length < 2) {
      await cliente.query(
        'UPDATE alunos SET ja_sorteado_ciclo = false WHERE turma_id = $1 AND ativo = true',
        [turmaId]
      );

      const cicloUpdate = await cliente.query(
        'UPDATE turmas SET ciclo_atual = ciclo_atual + 1 WHERE id = $1 RETURNING ciclo_atual',
        [turmaId]
      );

      cicloAtual = cicloUpdate.rows[0].ciclo_atual;
      cicloReiniciado = true;
      elegiveis = presentes; // todo mundo presente está elegível de novo
    }

    if (elegiveis.length < 2) {
      await cliente.query('ROLLBACK');
      return res.status(400).json({
        erro: 'Não há alunos suficientes nesta turma para sortear mesmo após reiniciar o ciclo.'
      });
    }

    // 4) Sorteia 2 alunos distintos do pool de elegíveis
    const sorteados = escolherAleatorios(elegiveis, 2);

    // 5) Marca os sorteados como "já sorteados neste ciclo" e grava o histórico
    for (const aluno of sorteados) {
      await cliente.query('UPDATE alunos SET ja_sorteado_ciclo = true WHERE id = $1', [aluno.id]);
      await cliente.query(
        'INSERT INTO sorteios (aluno_id, turma_id, ciclo) VALUES ($1, $2, $3)',
        [aluno.id, turmaId, cicloAtual]
      );
    }

    await cliente.query('COMMIT');

    res.json({
      sorteados: sorteados.map(a => ({ id: a.id, nome: a.nome })),
      ciclo: cicloAtual,
      ciclo_reiniciado: cicloReiniciado,
    });
  } catch (erro) {
    await cliente.query('ROLLBACK');
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao realizar o sorteio' });
  } finally {
    cliente.release();
  }
});

module.exports = router;
