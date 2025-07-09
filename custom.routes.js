import { Router } from 'express'
import index from './src/controllers/index.js'
import { login } from './src/controllers/login.js'
import config from './chinelo.config.js'

const customRoutes = Router()

const customRoutesList = [
  { httpMethod: 'GET', routePath: '/', controller: 'index' },
]

customRoutes.get('/', index)

export {customRoutes, customRoutesList }
