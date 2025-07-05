import express from 'express'
import { autoRoutes } from './src/core/autoRoutes.js'
import {rateLimit} from 'express-rate-limit'
import customRoutes from './custom.routes.js'
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
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

const PORT = process.env.PORT || config.port
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if(!config.apiMode) {
	app.set('view engine', config.templateEngine)
	app.set('views', config.urlViews)
}
app.use(express.static(config.dirPublic))
console.log("Applying customRoutes");
app.use(customRoutes)
app.use(auth); // Apply authentication middleware globally
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
