// ============================================================
// 📚 CONCEITO: server.js é o ponto de entrada do seu backend
// Aqui configuramos o Express e conectamos as rotas
// ============================================================

const express = require('express');
const cors = require('cors');
const autenticar = require('./middleware/autenticar');

const cursosRouter   = require('./routes/cursos');
const turmasRouter   = require('./routes/turmas');
const alunosRouter   = require('./routes/alunos');
const sorteioRouter  = require('./routes/sorteio');
const authRouter     = require('./routes/auth');
const usuariosRouter = require('./routes/usuarios');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARES ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── ROTAS PÚBLICAS (não exigem login) ───────────────────────
app.use('/api/auth', authRouter);

// ── ROTAS PROTEGIDAS (exigem JWT válido) ────────────────────
app.use('/api/cursos',    autenticar, cursosRouter);
app.use('/api/turmas',    autenticar, turmasRouter);
app.use('/api/alunos',    autenticar, alunosRouter);
app.use('/api/sorteio',   autenticar, sorteioRouter);
app.use('/api/usuarios',  usuariosRouter); // já tem autenticar + apenasAdmin internamente

// ── ROTA RAIZ (health check) ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Sorteador de Limpeza funcionando! 🧹' });
});

// ── INICIALIZAR ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
