// ============================================================
// 📚 CONCEITO: Rotas de gestão de usuários (só admin)
//
// Todas as rotas aqui passam por dois middlewares em sequência:
//   autenticar → verifica o JWT
//   apenasAdmin → verifica se role === 'admin'
//
// Isso é "composição de middlewares" — cada um faz uma coisa só.
// ============================================================

const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const autenticar = require('../middleware/autenticar');
const apenasAdmin = require('../middleware/apenasAdmin');

const router = express.Router();

// Aplica autenticação + autorização em todas as rotas deste arquivo
router.use(autenticar, apenasAdmin);

// ── LISTAR usuários ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nome, email, role, ativo, criado_em FROM usuarios ORDER BY criado_em DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar usuários.' });
  }
});

// ── CRIAR usuário ────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { nome, email, senha, role = 'professor' } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }
  if (!['admin', 'professor'].includes(role)) {
    return res.status(400).json({ erro: 'Role inválida.' });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 12);
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, role, ativo, criado_em`,
      [nome.trim(), email.toLowerCase().trim(), senha_hash, role]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ erro: 'Este email já está cadastrado.' });
    }
    res.status(500).json({ erro: 'Erro ao criar usuário.' });
  }
});

// ── ATIVAR / DESATIVAR usuário ───────────────────────────────
router.patch('/:id/ativo', async (req, res) => {
  const { ativo } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE usuarios SET ativo = $1 WHERE id = $2 RETURNING id, nome, email, role, ativo',
      [ativo, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
  }
});

// ── REDEFINIR senha ──────────────────────────────────────────
router.patch('/:id/senha', async (req, res) => {
  const { senha } = req.body;
  if (!senha || senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
  }
  try {
    const senha_hash = await bcrypt.hash(senha, 12);
    const { rowCount } = await pool.query(
      'UPDATE usuarios SET senha_hash = $1 WHERE id = $2',
      [senha_hash, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json({ mensagem: 'Senha atualizada com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao redefinir senha.' });
  }
});

module.exports = router;
