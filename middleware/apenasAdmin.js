// ============================================================
// 📚 CONCEITO: Middleware de autorização por role
//
// Autorização ≠ Autenticação:
//   - Autenticação: "quem é você?" (verificado pelo JWT)
//   - Autorização:  "você pode fazer isso?" (verificado aqui)
//
// Este middleware DEVE ser usado APÓS autenticar(), porque
// depende de req.usuario que o autenticar() preenche.
// ============================================================

function apenasAdmin(req, res, next) {
  if (req.usuario?.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
  }
  next();
}

module.exports = apenasAdmin;
