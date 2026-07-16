// ============================================================
// 📚 CRUD de Turmas — vinculadas a um Curso (curso_id)
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// ── GET /api/turmas ──────────────────────────────────────────
// ?curso_id=3 filtra turmas de um curso específico (opcional)
// Sempre traz o nome do curso via JOIN, útil para exibir no menu lateral
router.get('/', async (req, res) => {
  try {
    const { curso_id } = req.query;

    const query = curso_id
      ? `SELECT t.*, c.nome AS curso_nome FROM turmas t
         JOIN cursos c ON c.id = t.curso_id
         WHERE t.curso_id = $1
         ORDER BY t.nome`
      : `SELECT t.*, c.nome AS curso_nome FROM turmas t
         JOIN cursos c ON c.id = t.curso_id
         ORDER BY c.nome, t.nome`;

    const valores = curso_id ? [curso_id] : [];
    const resultado = await pool.query(query, valores);
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar turmas' });
  }
});

// ── GET /api/turmas/:id ──────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      `SELECT t.*, c.nome AS curso_nome FROM turmas t
       JOIN cursos c ON c.id = t.curso_id
       WHERE t.id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Turma não encontrada' });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar turma' });
  }
});

// ── POST /api/turmas ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { nome, curso_id } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O nome da turma é obrigatório' });
    }
    if (!curso_id) {
      return res.status(400).json({ erro: 'O curso da turma é obrigatório' });
    }

    const resultado = await pool.query(
      'INSERT INTO turmas (nome, curso_id) VALUES ($1, $2) RETURNING *',
      [nome.trim(), curso_id]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar turma' });
  }
});

// ── PUT /api/turmas/:id ───────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, curso_id } = req.body;

    const resultado = await pool.query(
      `UPDATE turmas
       SET nome = COALESCE($1, nome),
           curso_id = COALESCE($2, curso_id)
       WHERE id = $3
       RETURNING *`,
      [nome, curso_id, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Turma não encontrada' });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar turma' });
  }
});

// ── DELETE /api/turmas/:id ────────────────────────────────────
// Hard delete: apaga a turma e (via CASCADE) seus alunos e sorteios.
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('DELETE FROM turmas WHERE id = $1 RETURNING *', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Turma não encontrada' });
    }
    res.json({ mensagem: 'Turma removida', turma: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao remover turma' });
  }
});

module.exports = router;
