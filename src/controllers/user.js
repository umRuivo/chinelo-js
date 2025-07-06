import { User } from '../models/User.js'
import { auth, adminAuth } from '../middlewares/auth.js'
import { validateUser, validateUid } from '../middlewares/validation.js'
import config from './../../chinelo.config.js'

export async function index(req, res) {
	try {
		const users = await User.findMany()
		res.render('listUsers', { title: 'Lista de Usuários', users })
	} catch (error) {
		console.error('Erro ao listar usuários para a view:', error)
		res.status(500).json({ error: 'Erro ao listar usuários' })
	}
}

export async function list(req, res) {
	try {
		const users = await User.findMany()
		res.render('listUsers', { title: 'Lista de Usuários', users })
	} catch (error) {
		console.error('Erro ao listar usuários para a view:', error)
		res.status(500).json({ error: 'Erro ao listar usuários' })
	}
}

export async function show(req, res) {
	try {
		const { uid } = req.params
		const user = await User.findUnique({ where: { uid } })
		if (!user) {
			return res.status(404).json({ error: 'Usuário não encontrado' })
		}
		res.json({
			success: true,
			data: user
		})
	} catch (error) {
		res.status(500).json({ error: 'Erro ao buscar usuário' })
	}
}

export async function edit(req, res) {
	try {
		const { uid } = req.params
		const user = await User.findUnique({ where: { uid } })
		if (!user) {
			return res.status(404).json({ error: 'Usuário não encontrado' })
		}
		res.render('editUser', { title: 'Editar Usuário', user })
	} catch (error) {
		console.error('Erro ao carregar formulário de edição:', error)
		res.status(500).json({ error: 'Erro ao carregar formulário de edição' })
	}
}

export async function create(req, res) {
	try {
		const { name, email, password } = req.body

		// Check if user with this email already exists
		const existingUser = await User.findUnique({ where: { email } })
		if (existingUser) {
			if (req.is('json')) {
				return res.status(409).json({ error: 'Usuário com este email já existe.' })
			}
			return res.render('createUser', { title: 'Criar Usuário', errorMessage: 'Usuário com este email já existe.' })
		}

		const newUser = await User.create({
			data: {
				name,
				email,
				password
			}
		})

		if (req.is('json')) {
			return res.status(201).json({
				success: true,
				message: 'Usuário criado com sucesso',
				data: newUser
			})
		}

		res.redirect('/user/list' + config.routeSufix)

	} catch (error) {
		console.error('Erro detalhado ao criar usuário:', error)
		res.status(500).json({ error: 'Erro ao criar usuário', details: error.message })
	}
}

export function newUser(req, res) {
	res.render('createUser', { title: 'Criar Usuário' })
}

export async function update(req, res) {
	try {
		const { uid } = req.params
		const { name, email } = req.body
		const updatedUser = await User.update({
			where: { uid },
			data: { name, email }
		})

		if (req.is('json')) {
			return res.json({
				success: true,
				message: 'Usuário atualizado com sucesso',
				data: updatedUser
			})
		}

		res.redirect('/user/list' + config.routeSufix)

	} catch (error) {
		console.error('Erro ao atualizar usuário:', error)
		res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message })
	}
}

export async function deleteUser(req, res) {
	try {
		const { uid } = req.params
		console.log('UID recebido para exclusão:', uid)
		await User.delete({ where: { uid } })

		if (req.is('json')) {
			return res.json({
				success: true,
				message: 'Usuário deletado com sucesso'
			})
		}

		res.redirect('/user/list' + config.routeSufix)

	} catch (error) {
		console.error('Erro detalhado ao deletar usuário:', error)
		res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message })
	}
}



export function ola(req, res) {
	const {name} = req.params
	res.send(`Greetings, ${name}!`)
}

ola.routeParams = ['name']
ola.routePrefix = 'demo/'
create.httpMethod = 'POST'
create.middlewares = [validateUser,auth]
newUser.middlewares = [auth]
index.middlewares = [auth]
list.middlewares = [auth]

// list.httpMethod = 'GET'

edit.httpMethod = 'GET'
edit.middlewares = [validateUid, auth]
edit.routeParams = ['uid']
update.routeParams = ['uid']

update.httpMethod = 'POST' // Changed to POST for form submission
update.middlewares = [validateUid, validateUser, auth]

deleteUser.routeParams = ['uid']
deleteUser.httpMethod = 'POST' // Changed to POST for form submission
deleteUser.middlewares = []

show.middlewares = [validateUid]


