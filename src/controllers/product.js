import { Product } from '../models/Product.js'
import { auth, adminAuth } from '../middlewares/auth.js'
import { validateProduct, validateUid } from '../middlewares/validation.js'

export async function index(req, res) {
	try {
		const products = await Product.findMany()
		res.json({
			success: true,
			data: products,
			total: products.length
		})
	} catch (error) {
		res.status(500).json({ error: 'Erro ao listar produtos' })
	}
}

export async function show(req, res) {
	try {
		const { uid } = req.params
		const product = await Product.findUnique({ where: { uid } })
		if (!product) {
			return res.status(404).json({ error: 'Produto não encontrado' })
		}
		res.json({
			success: true,
			data: product
		})
	} catch (error) {
		res.status(500).json({ error: 'Erro ao buscar produto' })
	}
}

export async function create(req, res) {
	try {
		const { name, price, description } = req.body
		const newProduct = await Product.create({
			data: {
				name,
				price,
				description
			}
		})
		res.status(201).json({
			success: true,
			message: 'Produto criado com sucesso',
			data: newProduct
		})
	} catch (error) {
		res.status(500).json({ error: 'Erro ao criar produto' })
	}
}

export async function update(req, res) {
	try {
		const { uid } = req.params
		const { name, price, description } = req.body
		const updatedProduct = await Product.update({
			where: { uid },
			data: { name, price, description }
		})
		res.json({
			success: true,
			message: 'Produto atualizado com sucesso',
			data: updatedProduct
		})
	} catch (error) {
		res.status(500).json({ error: 'Erro ao atualizar produto' })
	}
}

export async function deleteProduct(req, res) {
	try {
		const { uid } = req.params
		await Product.delete({ where: { uid } })
		res.json({
			success: true,
			message: 'Produto deletado com sucesso'
		})
	} catch (error) {
		res.status(500).json({ error: 'Erro ao deletar produto' })
	}
}

export const middlewares = [
	['create', [validateProduct, auth, adminAuth]],
	['update', [validateUid, validateProduct, auth, adminAuth]],
	['deleteProduct', [validateUid, auth, adminAuth]],
	['show', [validateUid]]
]

export const httpMethods = [
	['create', 'POST'],
	['update', 'PUT'],
	['deleteProduct', 'DELETE']
]

export const routeParams = [
	['deleteProduct', ['uid']]
]