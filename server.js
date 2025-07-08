import express from 'express'
import { autoRoutes } from './core/autoRoutes.js'
import {rateLimit} from 'express-rate-limit'
import { router as customRoutes, customRoutesList } from './custom.routes.js'
import cors from 'cors'
import config from './chinelo.config.js'
import session from 'express-session'
import { auth } from './src/middlewares/auth.js'
import { getRota } from './core/helpers/routeHelper.js'

const app = express()

app.use(session({
	secret: 'your-secret-key',
	resave: false,
	saveUninitialized: true,
	rolling: true,
	cookie: { secure: false, maxAge: 5 * 60 * 1000 }
}))

app.use((req, res, next) => {
	res.locals.user = req.session.user
	next()
})

// Middleware para disponibilizar rotas nas views
app.use(async (req, res, next) => {
    res.locals.homeUrl = await getRota('index');
    res.locals.usersUrl = await getRota('user'); // Assumindo que 'user' tem um método 'index'
    res.locals.loginUrl = await getRota('login');
    res.locals.logoutUrl = await getRota('login', 'logout');
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
app.use(customRoutes)

await autoRoutes(app)
Object.keys(app.locals.allRoutes).forEach(controllerName => {
  customRoutesList.forEach(customRoute => {
    if (customRoute.controller === controllerName) {
      app.locals.allRoutes[controllerName].push(customRoute);
    }
  });
});
app.use(auth)
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
	windowMs: 15 * 60 * 1000,
	max: 1,
	message: 'Muitas requisições, tente novamente em 15 minutos'
})
if(config.activeLimiter) app.use(limiter)

app.locals.globalData = config.globalData
app.use(cors())
app.listen(PORT, config.siteIP ,() => {
	console.log(`
🚀 Servidor rodando na porta ${PORT}`)
	console.log(`
📍 http://${config.siteIP}:${PORT}`)
})

