const prefix = 'admin/'
const sufix = '/index.html'
const time = 30

export default {
	globalData: {
		siteName: 'Chinelo JS',
		author: 'junior.alves@dr.com',
		prefix: prefix,
		sufix: sufix,
		sessionTime: 10
	},
	port: 3000,
	siteIP: '0.0.0.0',
	urlViews: './src/views',
	dirPublic: './public',
	templateEngine: 'pug',
	pageNotFound: 'notfound.pug',
	msgNotFound: 'Ops!!! Página não encontrada!!!',
	activeLimiter: true,
	apiMode: false,
	routeSufix: sufix,
	globalRoutePrefix: prefix,
	maxRequests: 10,
	maxRequestsTime: time,
	maxRequestsMessage: `Muitas requisições, por favor tente novamente em ${time} minutos!`
}
