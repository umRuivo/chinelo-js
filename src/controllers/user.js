import { User } from '../models/User.js'
import { auth, adminAuth } from '../middlewares/auth.js'
import { validateUser, validateUid } from '../middlewares/validation.js'

export async function index(req, res) {
  try {
    const users = await User.findMany();
    res.render('listUsers', { title: 'Lista de Usuários', users });
  } catch (error) {
    console.error('Erro ao listar usuários para a view:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
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

		res.redirect('/user/list')

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

		res.redirect('/user/list')

	} catch (error) {
		console.error('Erro ao atualizar usuário:', error)
		res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message })
	}
}

export async function deleteUser(req, res) {
	try {
		const { uid } = req.params
		await User.delete({ where: { uid } })

		if (req.is('json')) {
			return res.json({
				success: true,
				message: 'Usuário deletado com sucesso'
			})
		}

		res.redirect('/user/list')

	} catch (error) {
		console.error('Erro detalhado ao deletar usuário:', error)
		res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message })
	}
}

export function loginPage(req, res) {
	res.render('login', { title: 'Login' })
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findUnique({ where: { email } });

    if (!user || user.password !== password) { // WARNING: Insecure password comparison. Use bcrypt for production!
      if (req.is('json')) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }
      return res.redirect('/user/loginPage'); // Redirect back to login on failure
    }

    req.session.user = { uid: user.uid, email: user.email, name: user.name, role: user.role };

    // Successful login - you might want to set a session or send a JWT here
    if (req.is('json')) {
      return res.json({ success: true, message: 'Login bem-sucedido', user: { uid: user.uid, email: user.email, name: user.name } });
    }
    
    res.redirect('/user');

  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).json({ error: 'Erro no servidor durante o login', details: error.message });
  }
}

create.httpMethod = 'POST'
create.middlewares = [validateUser]

list.httpMethod = 'GET'

edit.httpMethod = 'GET'
edit.middlewares = [validateUid]
edit.routeParams = ['uid']
update.routeParams = ['uid']

update.httpMethod = 'POST' // Changed to POST for form submission
update.middlewares = [validateUid, validateUser, auth]

deleteUser.routeParams = ['uid']
deleteUser.httpMethod = 'POST' // Changed to POST for form submission
deleteUser.middlewares = []

show.middlewares = [validateUid]

loginPage.httpMethod = 'GET'
login.httpMethod = 'POST'
