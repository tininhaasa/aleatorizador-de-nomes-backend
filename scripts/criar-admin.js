// ============================================================
// 📚 CONCEITO: Script para criar o primeiro usuário admin ("professor master")
//
// A rota POST /api/usuarios só aceita requisições de um admin já logado.
// Então o PRIMEIRO admin precisa ser criado direto no banco — é isso que
// este script faz. A senha é transformada em hash bcrypt antes de salvar.
//
// Uso:
//   node scripts/criar-admin.js "Nome" email@escola.com "senha"
//
// Se o email já existir, o usuário vira admin e recebe a nova senha.
// ============================================================

const bcrypt = require('bcrypt');
const pool = require('../db/pool');

async function main() {
  const [nome, email, senha] = process.argv.slice(2);

  if (!nome || !email || !senha) {
    console.error('Uso: node scripts/criar-admin.js "Nome" email@escola.com "senha"');
    process.exit(1);
  }
  if (senha.length < 6) {
    console.error('A senha deve ter pelo menos 6 caracteres.');
    process.exit(1);
  }

  const senha_hash = await bcrypt.hash(senha, 12);

  const { rows } = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE
       SET nome = EXCLUDED.nome, senha_hash = EXCLUDED.senha_hash,
           role = 'admin', ativo = TRUE
     RETURNING id, nome, email, role`,
    [nome.trim(), email.toLowerCase().trim(), senha_hash]
  );

  console.log('Admin pronto:', rows[0]);
}

main()
  .catch((err) => {
    console.error('Erro ao criar admin:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
