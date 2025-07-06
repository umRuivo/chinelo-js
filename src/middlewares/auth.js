import config from '../../chinelo.config.js'

export function auth(req, res, next) {
	const publicRoutes = ['/login', '/user/new', '/user/create'] // Add other public routes here

	if (publicRoutes.includes(req.path)) {
		return next()
	}

	if (!req.session.user) {
		if (req.is('json')) {
			return res.status(401).json({
				error: 'Usuário não autenticado'
			})
		}
		return res.redirect('/login' + config.routeSufix)
	}

	req.user = req.session.user
	next()
}

export function adminAuth(req, res, next) {
	// Verifica se já passou pelo middleware de auth
	if (!req.user) {
		return res.status(401).json({
			error: 'Usuário não autenticado'
		})
	}

	// Simulação de verificação de admin
	if (req.user.role !== 'admin') {
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


