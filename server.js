// ============================================================
// 📚 CONCEITO: server.js é o ponto de entrada do seu backend
// Aqui configuramos o Express e conectamos as rotas
// ============================================================

const express = require('express');
const cors = require('cors');
const cursosRouter = require('./routes/cursos');
const turmasRouter = require('./routes/turmas');
const alunosRouter = require('./routes/alunos');
const sorteioRouter = require('./routes/sorteio');

const app = express();
const PORT = 3000;

// ── MIDDLEWARES ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── ROTAS ───────────────────────────────────────────────────
app.use('/api/cursos', cursosRouter);
app.use('/api/turmas', turmasRouter);
app.use('/api/alunos', alunosRouter);
app.use('/api/sorteio', sorteioRouter);

// ── ROTA RAIZ (só para testar que o servidor está vivo) ──────
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Sorteador de Limpeza funcionando! 🧹' });
});

// ── INICIALIZAR O SERVIDOR ───────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em https://aleatorizador-de-nomes-backend-three.onrender.com`);
});
