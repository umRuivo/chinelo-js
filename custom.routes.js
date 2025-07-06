import { Router } from 'express'
import index from './src/controllers/index.js'
import { login } from './src/controllers/login.js'
import config from './chinelo.config.js'

const router = Router()

const customRoutesList = [
  { httpMethod: 'GET', routePath: '/', controller: 'index' },
  { httpMethod: 'POST', routePath: '/login/login', controller: 'login' }
]

router.get('/', index)
router.post('/login/login', login)

export { router, customRoutesList }
