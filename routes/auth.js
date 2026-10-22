// ============================================================
// 📚 CONCEITO: Rota de autenticação
//
// POST /api/auth/login
//   1. Busca o usuário pelo email
//   2. Compara a senha com o hash salvo (bcrypt.compare)
//   3. Se válido, gera um JWT assinado com JWT_SECRET
//   4. Retorna o token + dados básicos do usuário
//
// POST /api/auth/me
//   Retorna os dados do usuário logado (útil para o frontend
//   saber o nome e role sem precisar decodificar o token)
// ============================================================

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const autenticar = require('../middleware/autenticar');

const router = express.Router();

// ── LOGIN ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email.toLowerCase().trim()]
    );

    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao fazer login.' });
  }
});

// ── ME (dados do usuário logado) ────────────────────────────
router.get('/me', autenticar, (req, res) => {
  res.json({ usuario: req.usuario });
});

module.exports = router;
