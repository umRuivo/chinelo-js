import { Router } from 'express'
import index from './src/controllers/index.js'
import { login } from './src/controllers/login.js'

const router = Router()

const customRoutesList = [
  { httpMethod: 'GET', routePath: '/', controller: 'index' },
  { httpMethod: 'POST', routePath: '/login', controller: 'login' }
]

router.get('/', index)
router.post('/login', login)

export { router, customRoutesList }
