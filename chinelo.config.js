const prefix = ''
const sufix = ''
const requestsTime = 15

export default {
	globalData: {
		siteName: 'Chinelo JS',
		author: 'junior.alves@dr.com',
		prefix: prefix,
		sufix: sufix,
		sessionTime: 1
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
	maxRequests: 100,
	maxRequestsTime: requestsTime,
	maxRequestsMessage: `Muitas requisições, por favor tente novamente em ${requestsTime} minutos!`
}
