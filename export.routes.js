import { Router } from 'express'
import { greet as example_greet } from './src/controllers/example.js'
import { hello as example_hello } from './src/controllers/example.js'
import { index as example_index } from './src/controllers/example.js'
import { showRoute as example_showRoute } from './src/controllers/example.js'
import indexDefault from './src/controllers/index.js'
import { index as login_index } from './src/controllers/login.js'
import { login as login_login } from './src/controllers/login.js'
import { logout as login_logout } from './src/controllers/login.js'
import { create as product_create } from './src/controllers/product.js'
import { deleteProduct as product_deleteProduct } from './src/controllers/product.js'
import { index as product_index } from './src/controllers/product.js'
import { show as product_show } from './src/controllers/product.js'
import { update as product_update } from './src/controllers/product.js'
import { create as user_create } from './src/controllers/user.js'
import { deleteUser as user_deleteUser } from './src/controllers/user.js'
import { edit as user_edit } from './src/controllers/user.js'
import { index as user_index } from './src/controllers/user.js'
import { list as user_list } from './src/controllers/user.js'
import { newUser as user_newUser } from './src/controllers/user.js'
import { ola as user_ola } from './src/controllers/user.js'
import { show as user_show } from './src/controllers/user.js'
import { update as user_update } from './src/controllers/user.js'
import { validateProduct } from './src/middlewares/validation.js'
import { auth } from './src/middlewares/auth.js'
import { adminAuth } from './src/middlewares/auth.js'
import { validateUid } from './src/middlewares/validation.js'
import { validateUser } from './src/middlewares/validation.js'
const router = Router()

router.get('/example/greet/:name', example_greet)
router.get('/example/hello', example_hello)
router.get('/example', example_index)
router.get('/example/showRoute', example_showRoute)
router.get('/', indexDefault)
router.get('/login', login_index)
router.post('/login/login', login_login)
router.get('/login/logout', login_logout)
router.post('/product/create', validateProduct, auth, adminAuth, product_create)
router.delete('/product/deleteProduct/:uid', validateUid, auth, adminAuth, product_deleteProduct)
router.get('/product', product_index)
router.get('/product/show', validateUid, product_show)
router.put('/product/update', validateUid, validateProduct, auth, adminAuth, product_update)
router.post('/user/create', validateUser, auth, user_create)
router.post('/user/deleteUser/:uid', user_deleteUser)
router.get('/user/edit/:uid', validateUid, auth, user_edit)
router.get('/user', auth, user_index)
router.get('/user/list', auth, user_list)
router.get('/user/newUser', auth, user_newUser)
router.get('/demo/user/ola/:name/:coisa', user_ola)
router.get('/user/show/:uid', validateUid, user_show)
router.post('/user/update/:uid', validateUid, validateUser, auth, user_update)

export { router }
