import express from 'express'
import { autoRoutes } from './core/autoRoutes.js'
import {rateLimit} from 'express-rate-limit'
import { router as customRoutes, customRoutesList } from './custom.routes.js'
import cors from 'cors'
import config from './chinelo.config.js'
import session from 'express-session'
import { auth } from './src/middlewares/auth.js'

const app = express()

app.use(session({
	secret: 'your-secret-key', // Troque por uma chave secreta forte
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false } // Para desenvolvimento. Em produção, use true com HTTPS
}))

app.use((req, res, next) => {
	res.locals.user = req.session.user
	next()
})

const PORT = process.env.PORT || config.port
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if(!config.apiMode) {
	app.set('view engine', config.templateEngine)
	app.set('views', config.urlViews)
}
app.use(express.static(config.dirPublic))
app.use(customRoutes)
// if(config.activeLimiter) app.use(limiter)
await autoRoutes(app)
app.locals.allRoutes = [...app.locals.allRoutes, ...customRoutesList]
app.use(auth) // Apply authentication middleware globally
app.use((req, res) => {
	if(!config.apiMode)
		res.status(404).render(config.pageNotFound,{
			title: config.msgNotFound,
			message: config.msgNotFound,
			statusCode: 404
		})
	else
		res.status(404).json({
			title: 'error',
			message: config.msgNotFound,
			statusCode: 404
		})
})
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 1, // máximo 100 requisições por IP
	message: 'Muitas requisições, tente novamente em 15 minutos'
})
if(config.activeLimiter) app.use(limiter)

app.locals.globalData = config.globalData
app.use(cors())
app.listen(PORT, config.siteIP ,() => {
	console.log(`\n🚀 Servidor rodando na porta ${PORT}`)
	console.log(`\n📍 http://${config.siteIP}:${PORT}`)
})
