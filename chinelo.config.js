const prefix = ''

export default {
	globalData: {
		siteName: 'Chinelo JS',
		author: '@junior.php',
		prefix
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
	routeSufix: '.html',
	globalRoutePrefix: prefix
}
