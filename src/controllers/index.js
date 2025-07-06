export default function index(req, res) {
	res.render('index', {
		title: '',
		description: 'Esta é a página sobre nós.',
		allRoutes: req.app.locals.allRoutes
	})
}
