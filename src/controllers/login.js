import { User } from '../models/User.js'

export function logout(req, res) {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).send('Failed to log out')
		}
		res.redirect('/login')
	})
}

export function index(req, res) {
	console.log('Acessando a página de login')
	res.render('login', { title: 'Login' })
}

export async function login(req, res) {
	try {
		const { email, password } = req.body

		const user = await User.findUnique({ where: { email } })

		if (!user || user.password !== password) { // WARNING: Insecure password comparison. Use bcrypt for production!
			if (req.is('json')) {
				return res.status(401).json({ error: 'Email ou senha inválidos' })
			}
			return res.render('login', { title: 'Login', errorMessage: 'Email ou senha inválidos' }) // Render login page with error
		}

		req.session.user = { uid: user.uid, email: user.email, name: user.name, role: user.role }

		// Successful login - you might want to set a session or send a JWT here
		if (req.is('json')) {
			return res.json({ success: true, message: 'Login bem-sucedido', user: { uid: user.uid, email: user.email, name: user.name } })
		}

		res.redirect('/user')

	} catch (error) {
		console.error('Erro durante o login:', error)
		res.status(500).json({ error: 'Erro no servidor durante o login', details: error.message })
	}
}


