import express from 'express'
import session from 'express-session'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { getRota } from '../helpers/routeHelper.js'

export function setupGlobalMiddlewares(app, config) {
	app.use(session({
		secret: 'your-secret-key',
		resave: false,
		saveUninitialized: true,
		rolling: true,
		cookie: { secure: false, maxAge: config.globalData.sessionTime * 60 * 1000 }
	}))

	app.use((req, res, next) => {
		res.locals.user = req.session.user
		next()
	})

	app.use(async(req, res, next) => {
		res.locals.homeUrl = await getRota('index')
		res.locals.usersUrl = await getRota('user')
		res.locals.loginUrl = await getRota('login')
		res.locals.logoutUrl = await getRota('login', 'logout')
		next()
	})

	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	if (!config.apiMode) {
		app.set('view engine', config.templateEngine)
		app.set('views', config.urlViews)
	}

	app.use(express.static(config.dirPublic))

	if (config.activeLimiter) {
		const limiter = rateLimit({
			windowMs: config.maxRequestsTime * 60 * 1000,
			max: config.maxRequests,
			message: config.maxRequestsMessage
		})
		app.use(limiter)
	}

	app.use(cors())

	app.locals.globalData = config.globalData
}
