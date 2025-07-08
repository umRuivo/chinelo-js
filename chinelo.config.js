const prefix = ''
const sufix = '.asp'

export default {
	globalData: {
		siteName: 'Chinelo JS',
		author: '@junior.php',
		prefix: prefix,
		sufix: sufix,
		sessionTime: 5
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
	globalRoutePrefix: prefix
}
