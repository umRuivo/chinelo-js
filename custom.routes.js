import { Router } from 'express'
import index from './src/controllers/index.js'

const router = Router()
router.get('/', index)

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

export default router

// post (create, store, post)
// put  (update, edit, put)
// delete (remove, delete)
// patch (patch)
