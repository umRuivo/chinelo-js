export function validateUser(req, res, next) {
	const { name, email } = req.body

	if (!name || !email) {
		return res.status(400).json({
			error: 'Nome e email são obrigatórios'
		})
	}

	if (!email.includes('@')) {
		return res.status(400).json({
			error: 'Email inválido'
		})
	}

	next()
}

export function validateUid(req, res, next) {
	const { uid } = req.params

	if (!uid || typeof uid !== 'string') {
		return res.status(400).json({
			error: 'UID inválido'
		})
	}

	next()
}

export function validateProduct(req, res, next) {
	const { name, price } = req.body

	if (!name || !price) {
		return res.status(400).json({
			error: 'Nome e preço são obrigatórios'
		})
	}

	if (typeof price !== 'number' || price <= 0) {
		return res.status(400).json({
			error: 'Preço inválido'
		})
	}

	next()
}
