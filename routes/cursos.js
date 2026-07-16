// ============================================================
// 📚 CRUD de Cursos — o nível mais alto da hierarquia
// (Curso → Turma → Aluno)
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// ── GET /api/cursos ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM cursos ORDER BY nome');
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar cursos' });
  }
});

// ── POST /api/cursos ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'O nome do curso é obrigatório' });
    }

    const resultado = await pool.query(
      'INSERT INTO cursos (nome) VALUES ($1) RETURNING *',
      [nome.trim()]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar curso' });
  }
});

// ── PUT /api/cursos/:id ───────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const resultado = await pool.query(
      'UPDATE cursos SET nome = COALESCE($1, nome) WHERE id = $2 RETURNING *',
      [nome, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar curso' });
  }
});

// ── DELETE /api/cursos/:id ────────────────────────────────────
// Apaga de verdade (hard delete). Como a FK turmas.curso_id tem
// ON DELETE CASCADE, isso apagaria também as turmas e tudo dentro
// delas — por isso pedimos confirmação extra no frontend antes de chamar isso.
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('DELETE FROM cursos WHERE id = $1 RETURNING *', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    res.json({ mensagem: 'Curso removido', curso: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao remover curso' });
  }
});

module.exports = router;
