import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { getRota } from '../helpers/routeHelper.js';
import { auth } from '../../src/middlewares/auth.js';

export function setupGlobalMiddlewares(app, config) {
    app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        rolling: true,
        cookie: { secure: false, maxAge: 5 * 60 * 1000 }
    }));

    app.use((req, res, next) => {
        res.locals.user = req.session.user;
        next();
    });

    app.use(async (req, res, next) => {
        res.locals.homeUrl = await getRota('index');
        res.locals.usersUrl = await getRota('user');
        res.locals.loginUrl = await getRota('login');
        res.locals.logoutUrl = await getRota('login', 'logout');
        next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (!config.apiMode) {
        app.set('view engine', config.templateEngine);
        app.set('views', config.urlViews);
    }

    app.use(express.static(config.dirPublic));

    if (config.activeLimiter) {
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 1,
            message: 'Muitas requisições, tente novamente em 15 minutos'
        });
        app.use(limiter);
    }

    app.use(cors());

    app.locals.globalData = config.globalData;
}
