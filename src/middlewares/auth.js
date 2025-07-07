import config from '../../chinelo.config.js'

export function auth(req, res, next) {
	const publicRoutes = ['/login', '/user/new', '/user/create']

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
	if (!req.user) {
		return res.status(401).json({
			error: 'Usuário não autenticado'
		})
	}

	if (req.user.role !== 'admin') {
		return res.status(403).json({
			error: 'Acesso negado: apenas administradores'
		})
	}

	next()
}



