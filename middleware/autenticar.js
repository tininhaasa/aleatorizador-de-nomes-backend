// ============================================================
// 📚 CONCEITO: Middleware de autenticação JWT
//
// Um middleware no Express é uma função que roda ENTRE o
// recebimento da requisição e o handler da rota. Se o token
// for inválido, respondemos com 401 e a rota nunca executa.
//
// Fluxo:
//   Cliente envia: Authorization: Bearer <token>
//   → autenticar() valida o token com a chave secreta
//   → se válido: anexa req.usuario = { id, email, role }
//   → se inválido: responde 401 e para a requisição
// ============================================================

const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, nome, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = autenticar;
