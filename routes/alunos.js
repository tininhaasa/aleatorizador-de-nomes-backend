// ============================================================
// 📚 CONCEITO: Rotas CRUD escopadas por turma
//
// Agora todo aluno pertence a uma turma (turma_id). Por isso:
//   - GET exige ?turma_id=X na query string
//   - POST exige turma_id no corpo da requisição
//
// Continuamos usando queries parametrizadas ($1, $2...) para
// PREVENIR SQL Injection — nunca concatene strings em SQL.
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// ── GET /api/alunos?turma_id=3&todos=true ────────────────────
router.get('/', async (req, res) => {
  try {
    const { turma_id } = req.query;
    const incluirInativos = req.query.todos === 'true';

    if (!turma_id) {
      return res.status(400).json({ erro: 'turma_id é obrigatório' });
    }

    const query = incluirInativos
      ? 'SELECT * FROM alunos WHERE turma_id = $1 ORDER BY nome'
      : 'SELECT * FROM alunos WHERE turma_id = $1 AND ativo = true ORDER BY nome';

    const resultado = await pool.query(query, [turma_id]);
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar alunos' });
  }
});

// ── POST /api/alunos ─────────────────────────────────────────
// Body: { nome, turma_id }
router.post('/', async (req, res) => {
  try {
    const { nome, turma_id } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O nome é obrigatório' });
    }
    if (!turma_id) {
      return res.status(400).json({ erro: 'turma_id é obrigatório' });
    }

    const resultado = await pool.query(
      'INSERT INTO alunos (nome, turma_id) VALUES ($1, $2) RETURNING *',
      [nome.trim(), turma_id]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar aluno' });
  }
});

// ── PUT /api/alunos/:id ───────────────────────────────────────
// Permite editar nome e/ou reativar/desativar o aluno
// (não permitimos mover um aluno de turma por aqui — mantém o histórico coerente)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, ativo } = req.body;

    const resultado = await pool.query(
      `UPDATE alunos
       SET nome = COALESCE($1, nome),
           ativo = COALESCE($2, ativo)
       WHERE id = $3
       RETURNING *`,
      [nome, ativo, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar aluno' });
  }
});

// ── DELETE /api/alunos/:id ────────────────────────────────────
// "Soft delete": marcamos ativo = false em vez de apagar a linha,
// porque a tabela "sorteios" referencia o aluno e queremos manter o histórico.
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      'UPDATE alunos SET ativo = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.json({ mensagem: 'Aluno desativado', aluno: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao remover aluno' });
  }
});

module.exports = router;
