import { Router } from 'express'
import index from './src/controllers/index.js'

const router = Router()
router.get('/', index)

export default router

// post (create, store, post)
// put  (update, edit, put)
// delete (remove, delete)
// patch (patch)
