export function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    if (req.is('json')) {
      return res.status(401).json({
        error: 'Token de acesso requerido'
      });
    }
    return res.redirect('/user/loginPage');
  }

  // Simulação de validação de token
  if (token !== 'Bearer valid-token') {
    if (req.is('json')) {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }
    return res.redirect('/user/loginPage');
  }

  req.user = { id: 1, name: 'Usuário Autenticado' };
  next();
}

export function adminAuth(req, res, next) {
	// Verifica se já passou pelo middleware de auth
	if (!req.user) {
		return res.status(401).json({
			error: 'Usuário não autenticado'
		})
	}

	// Simulação de verificação de admin
	if (req.user.id !== 1) {
		return res.status(403).json({
			error: 'Acesso negado: apenas administradores'
		})
	}

	next()
}
// let cont = 0
// export function loginLimit( req, res, next){
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 5, // Apenas 5 tentativas de login
//     skipSuccessfulRequests: false
//   });
//   res.locals.cont = cont++//req.ip
//   next()
// }


