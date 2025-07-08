import { User } from '../models/User.js'
import config from '../../chinelo.config.js'
import { getRota } from '../../core/helpers/routeHelper.js'

function msg(params) {
	console.log(params)
}

export function logout(req, res) {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).send('Failed to log out')
		}
		res.redirect('/login' + config.routeSufix)
	})
}

export async function index(req, res) {
	msg('Acessando a página de login')
	const loginPostUrl = await getRota('login', 'login');
	res.render('login', { title: 'Login', loginPostUrl: loginPostUrl })
}

export async function login(req, res) {
	try {
		const { email, password } = req.body

		const user = await User.findUnique({ where: { email } })

		if (!user || user.password !== password) {
			if (req.is('json')) {
				return res.status(401).json({ error: 'Email ou senha inválidos' })
			}
			return res.render('login', { title: 'Login', errorMessage: 'Email ou senha inválidos' });
		}

		req.session.user = { uid: user.uid, email: user.email, name: user.name, role: user.role }

		
		if (req.is('json')) {
			return res.json({ success: true, message: 'Login bem-sucedido', user: { uid: user.uid, email: user.email, name: user.name } })
		}

		res.redirect('/user' + config.routeSufix);

	} catch (error) {
		console.error('Erro durante o login:', error)
		res.status(500).json({ error: 'Erro no servidor durante o login', details: error.message })
	}
}

export const httpMethods = [
	['login', 'POST']
]