import express from 'express'
import { autoRoutes } from './src/core/autoRoutes.js'
import {rateLimit} from 'express-rate-limit'
import customRoutes from './custom.routes.js'
import cors from 'cors'
import config from './chinelo.config.js'

const app = express()
const PORT = process.env.PORT || config.port
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if(!config.apiMode) {
	app.set('view engine', config.templateEngine)
	app.set('views', config.urlViews)
	app.use(express.static(config.dirPublic))
}
app.use(customRoutes)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100, // máximo 100 requisições por IP
	message: 'Muitas requisições, tente novamente em 15 minutos'
})
if(config.activeLimiter) app.use(limiter)
await autoRoutes(app)
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
app.locals.globalData = config.globalData
app.use(cors())
app.listen(PORT, '0.0.0.0' ,() => {
	console.log(`\n🚀 Servidor rodando na porta ${PORT}`)
	console.log(`\n📍 http://localhost:${PORT}`)
})
