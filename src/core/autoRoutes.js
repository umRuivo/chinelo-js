import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import config from '../../chinelo.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
let allRoutes = []
export async function autoRoutes(app) {
	const controllersPath = path.join(__dirname, '../controllers')

	if (!fs.existsSync(controllersPath)) {
		console.log('❌ Pasta controllers não encontrada')
		return
	}

	const controllerFiles = fs.readdirSync(controllersPath)
		.filter(file => file.endsWith('.js'))

	console.log('🔄 Carregando rotas automaticamente...\n')

	for (const file of controllerFiles) {
		const controllerName = path.basename(file, '.js')
		const controllerPath = path.join(controllersPath, file)

		try {
			const controller = await import(`file://${controllerPath}`)

			// Extrai o prefixo principal do controller (se existir)
			const mainPrefix = controller.mainPrefix || ''

			// Itera sobre todas as funções exportadas do controller
			Object.keys(controller).forEach(methodName => {
				const method = controller[methodName]

				if (typeof method === 'function') {
					registerRoute(app, controllerName, methodName, method, mainPrefix)
				}
			})

		} catch (error) {
			console.error(`❌ Erro ao carregar controller ${file}:`, error.message)
		}
	}

	console.log('\n✅ Todas as rotas foram carregadas com sucesso!')
}

function registerRoute(app, controllerName, methodName, method, mainPrefix = '') {
	// Extrai informações da função através de comentários ou propriedades
	if(controllerName == 'index') return
	const httpMethod = extractHttpMethod(method, methodName)
	const routePrefix = extractRoutePrefix(method)
	const routePath = buildRoutePath(controllerName, methodName, routePrefix, mainPrefix, method)
	const middlewares = extractMiddlewares(method)

	// Registra a rota no Express
	const expressMethod = app[httpMethod.toLowerCase()]

	if (expressMethod) {
		if (middlewares.length > 0) {
			expressMethod.call(app, routePath, ...middlewares, method)
		} else {
			expressMethod.call(app, routePath, method)
		}

		allRoutes = [...allRoutes, routePath.padEnd(30)]
		console.log(`📌 ${httpMethod.toUpperCase().padEnd(6)} ${routePath.padEnd(30)} → ${controllerName}.${methodName}()`)
		app.locals.allRoutes = allRoutes
	}
}


function buildRoutePath(controllerName, methodName, routePrefix, mainPrefix, method) {
	// Constrói o nome do controller com os prefixos
	// mainPrefix é aplicado primeiro, depois routePrefix (se existir)
	if(controllerName == 'index') return
	let finalControllerName = controllerName

	// Aplica o prefixo principal do controller
	if (mainPrefix && !routePrefix) {
		finalControllerName = `${mainPrefix}${controllerName}`
	}

	// Aplica o prefixo específico do método (sobrescreve o mainPrefix se existir)
	if (routePrefix && !mainPrefix) {
		finalControllerName = `${routePrefix}${controllerName}`
	}

	if (routePrefix && mainPrefix) {
		finalControllerName = `${mainPrefix}${routePrefix}${controllerName}`
	}

	// Extrai os parâmetros definidos na função
	const routeParams = extractRouteParams(method)

	// Constrói o caminho da rota
	let routePath
	if (methodName === 'index') {
		routePath = `/${config.globalRoutePrefix}${finalControllerName}${config.routeSufix}`
	} else {
		routePath = `/${config.globalRoutePrefix}${finalControllerName}/${methodName}${config.routeSufix}`
	}

	// Adiciona os parâmetros à rota se existirem
	if (routeParams.length > 0) {
		const paramsString = routeParams.map(param => `:${param}`).join('/')

		if (methodName === 'index') {
			routePath = `/${config.globalRoutePrefix}${finalControllerName}${config.routeSufix}/${paramsString}`
		} else {
			routePath = `/${config.globalRoutePrefix}${finalControllerName}/${methodName}${config.routeSufix}/${paramsString}`
		}
	}

	return routePath
}

function extractHttpMethod(method, methodName) {
	// Verifica se a função tem uma propriedade httpMethod definida
	if (method.httpMethod) {
		return method.httpMethod
	}

	// Inferência baseada no nome do método
	const methodLower = methodName.toLowerCase()

	if (methodLower.includes('create') || methodLower.includes('store') || methodLower.startsWith('post')) {
		return 'POST'
	} else if (methodLower.includes('update') || methodLower.includes('edit') || methodLower.startsWith('put')) {
		return 'PUT'
	} else if (methodLower.includes('delete') || methodLower.includes('remove') || methodLower.startsWith('delete')) {
		return 'DELETE'
	} else if (methodLower.includes('patch') || methodLower.startsWith('patch')) {
		return 'PATCH'
	} else {
		return 'GET'
	}
}

function extractRoutePrefix(method) {
	// Retorna o prefixo de rota definido na propriedade da função
	return method.routePrefix || ''
}

function extractRouteParams(method) {
	// Retorna parâmetros definidos na propriedade da função
	return method.routeParams || []
}

function extractMiddlewares(method) {
	// Retorna middlewares definidos na propriedade da função
	return method.middlewares || []
}
