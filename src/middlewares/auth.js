import config from '../../chinelo.config.js'
import { getRota } from '../../core/helpers/routeHelper.js'

export async function auth(req, res, next) {
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
		const loginUrl = await getRota('login');
		return res.redirect(loginUrl)
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



