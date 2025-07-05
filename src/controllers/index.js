export default function index(req, res) {
	// console.log(globalData)
	res.render('index', {
		title: '',
		description: 'Esta é a página sobre nós.'
	})
}
