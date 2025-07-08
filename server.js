import express from 'express'
import { autoRoutes } from './core/autoRoutes.js'
import { router as customRoutes, customRoutesList } from './custom.routes.js'
import config from './chinelo.config.js'
import { setupGlobalMiddlewares } from './core/middlewares/global.middleware.js'

const app = express()

setupGlobalMiddlewares(app, config);

const PORT = process.env.PORT || config.port
app.use(customRoutes)

await autoRoutes(app)
Object.keys(app.locals.allRoutes).forEach(controllerName => {
  customRoutesList.forEach(customRoute => {
    if (customRoute.controller === controllerName) {
      app.locals.allRoutes[controllerName].push(customRoute);
    }
  });
});

app.listen(PORT, config.siteIP ,() => {
	console.log(`
🚀 Servidor rodando na porta ${PORT}`)
	console.log(`
📍 http://${config.siteIP}:${PORT}`)
})

