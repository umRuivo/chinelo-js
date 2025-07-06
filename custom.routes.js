import { Router } from 'express'
import index from './src/controllers/index.js'
import { loginPage, login } from './src/controllers/login.js'

const router = Router()
router.get('/', index)

router.get('/login', loginPage)
router.post('/login', login)

export default router

// post (create, store, post)
// put  (update, edit, put)
// delete (remove, delete)
// patch (patch)
