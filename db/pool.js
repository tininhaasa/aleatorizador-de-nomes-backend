// ============================================================
// 📚 CONCEITO: Pool de conexões com o PostgreSQL
//
// Em vez de abrir/fechar uma conexão a cada consulta, mantemos
// um "pool" (piscina) de conexões reutilizáveis. A biblioteca
// "pg" gerencia isso para nós — pedimos uma conexão, usamos,
// e ela retorna ao pool para a próxima requisição.
//
// As credenciais vêm de variáveis de ambiente (arquivo .env),
// nunca devem ficar fixas (hardcoded) no código.
// ============================================================

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'sorteador_limpeza',
});

module.exports = pool;
