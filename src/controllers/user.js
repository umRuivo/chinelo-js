import { User } from '../models/User.js'
import { auth, adminAuth } from '../middlewares/auth.js'
import { validateUser, validateUid } from '../middlewares/validation.js'
import config from './../../chinelo.config.js'
import { getRota } from '../../core/helpers/routeHelper.js'

export async function index(req, res) {
	try {
		const users = await User.findMany()
		const newUserUrl = await getRota('user', 'newUser');

		const usersWithUrls = await Promise.all(users.map(async user => ({
			...user,
			editUrl: await getRota('user', 'edit', [user.uid]),
			showUrl: await getRota('user', 'show', [user.uid]),
			deleteUrl: await getRota('user', 'deleteUser', [user.uid])
		})));

		res.render('listUsers', { title: 'Lista de Usuários', users: usersWithUrls, newUserUrl })
	} catch (error) {
		console.error('Erro ao listar usuários para a view:', error)
		res.status(500).json({ error: 'Erro ao listar usuários' })
	}
}

export async function list(req, res) {
	try {
		const users = await User.findMany()
		const newUserUrl = await getRota('user', 'newUser');

		const usersWithUrls = await Promise.all(users.map(async user => ({
			...user,
			editUrl: await getRota('user', 'edit', [user.uid]),
			showUrl: await getRota('user', 'show', [user.uid]),
			deleteUrl: await getRota('user', 'deleteUser', [user.uid])
		})));

		res.render('listUsers', { title: 'Lista de Usuários', users: usersWithUrls, newUserUrl })
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
			return res.status(404).render('notfound', { title: 'Usuário não encontrado', message: 'Usuário não encontrado', statusCode: 404, globalData: req.app.locals.globalData })
		}
		const editUserUrl = await getRota('user', 'edit', [user.uid]);
		const listUsersUrl = await getRota('user', 'list');
		res.render('showUser', { title: 'Perfil do Usuário', user, globalData: req.app.locals.globalData, editUserUrl, listUsersUrl })
	} catch (error) {
		console.error('Erro ao buscar usuário para a view:', error)
		res.status(500).render('notfound', { title: 'Erro', message: 'Erro ao buscar usuário'})
	}
}

export async function edit(req, res) {
	try {
		const { uid } = req.params
		const user = await User.findUnique({ where: { uid } })
		if (!user) {
			return res.status(404).json({ error: 'Usuário não encontrado' })
		}
		const updateUserUrl = await getRota('user', 'update', [user.uid]);
		res.render('editUser', { title: 'Editar Usuário', user, updateUserUrl })
	} catch (error) {
		console.error('Erro ao carregar formulário de edição:', error)
		res.status(500).json({ error: 'Erro ao carregar formulário de edição' })
	}
}

export async function create(req, res) {
	try {
		const { name, email, password } = req.body

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

		res.redirect(await getRota('user', 'list'))

	} catch (error) {
		console.error('Erro detalhado ao criar usuário:', error)
		res.status(500).json({ error: 'Erro ao criar usuário', details: error.message })
	}
}

export async function newUser(req, res) {
	const createUserUrl = await getRota('user', 'create');
	res.render('createUser', { title: 'Criar Usuário', createUserUrl })
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

		res.redirect(await getRota('user', 'list'))

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

		res.redirect(await getRota('user', 'list'))

	} catch (error) {
		console.error('Erro detalhado ao deletar usuário:', error)
		res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message })
	}
}

export function ola(req, res) {
	const {name} = req.params
	res.send(`Greetings, ${name}!`)
}

export const mainPrefix = 'admin/'

export const middlewares = [
	['create', [validateUser,auth]],
	['newUser', [auth]],
	['index', [auth]],
	['list', [auth]],
	['ola', [auth]],
	['edit', [validateUid, auth]],
	['update', [validateUid, validateUser, auth]],
	['deleteUser', []],
	['show', [validateUid]]
]

export const httpMethods = [
	['create', 'POST'],
	['edit', 'GET'],
	['update', 'POST'],
	['deleteUser', 'POST'],
	['ola', 'POST']
]

export const routeParams = [
	['ola', ['name', 'coisa']],
	['edit', ['uid']],
	['update', ['uid']],
	['show', ['uid']],
	['deleteUser', ['uid']]
]

export const routePrefixes = [
	['ola', 'demo/']
]