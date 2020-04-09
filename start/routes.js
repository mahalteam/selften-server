'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/hastext', 'HomeController.hastext')

Route.group(() => {
    Route.get('register', 'Auth/RegisterController.showRegisterForm')
	Route.post('register', 'Auth/RegisterController.register').as('register')
	Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')
	Route.get('login', 'Auth/LoginController.showLoginForm')
	Route.post('login', 'Auth/LoginController.login').as('login')
	Route.get('logout', 'Auth/AuthenticatedController.logout')
})

Route.group(() => {
	Route.get('/', 'HomeController.index')
	Route.get('/table', 'HomeController.table')
	Route.get('/users', 'UserController.index')
	Route.get('/resetleaderboard', 'UserController.resetleaderboard')
	Route.get('/userview/:id', 'UserController.show')
	Route.get('/banned/:id', 'UserController.banned')
	Route.get('/unbanned/:id', 'UserController.unbanned')
	Route.get('/totalplayer/:id', 'MatchController.totalplayer')
	Route.get('/matchprize/:id', 'MatchController.matchprize')
	Route.get('/playerupdate/:id', 'MatchController.playerupdate')
	Route.post('/playerUpdateStore', 'MatchController.playerUpdateStore')
	Route.get('/update/:id', 'MatchController.updatestatus')
	Route.get('/transaction', 'TransactionController.store')
	Route.get('/transactionwithdraw', 'TransactionController.transactionwithdraw')
	Route.get('/orders', 'OrderController.index')
	Route.get('/transactionEdit/:id', 'TransactionController.edit')
	Route.get('/orderEdit/:id', 'OrderController.edit')
	Route.get('/eventorder', 'OrderController.eventorder1')
	Route.get('/eventorder/genarate', 'OrderController.genarate')
	Route.get('/eventorder/close', 'OrderController.close')
	Route.post('/transactionUpdate/:id', 'TransactionController.update')
	Route.post('/transactionUpdatewitdrwo/:id', 'TransactionController.updatewitdrwo')
	Route.post('/OrderUpdate/:id', 'OrderController.update')
	Route.resource('product', 'ProductController');
	Route.resource('match', 'MatchController');
	Route.resource('map', 'MapController');
	Route.resource('banner', 'BannerController');
	Route.resource('prize', 'PrizeController');
	Route.resource('notice', 'NoticeController');
	Route.resource('topuppackage', 'TopuppackageController');
	Route.resource('topupinfo', 'TopupinfoController');
	Route.resource('leaderboardinfo', 'LeaderboardinfoController');
	Route.get('prize/create/:id', 'PrizeController.create');
	Route.resource('paymentMethod', 'PaymentMethodController');
}).middleware(['auth'])

// api
Route.group(() => {
	Route.post('/register', 'AuthController.register1')
	Route.post('/login', 'AuthController.login')
	Route.post('/forgotpassword', 'AuthController.forgotPassword')
	Route.get('/updateuser/:id', 'AuthController.updateuser')
	Route.get('/matchproduct', 'ProductController.matchproduct')
	Route.get('/notice', 'NoticeController.all')
	Route.get('/topupinfo', 'TopupinfoController.show')
	Route.get('/topuppackage', 'TopuppackageController.all')
	Route.get('/banner', 'BannerController.all')
	Route.get('/match/:id', 'MatchController.matchbyid')
	Route.get('/match/', 'MatchController.matchbyid')
	Route.get('/matchs/:status', 'MatchController.matchbystatus')
	Route.get('/singlematch/:id', 'MatchController.singlematch')
	Route.get('/paymentMethod', 'PaymentMethodController.paymentMethod')
	Route.get('/paymentMethod/:id', 'PaymentMethodController.paymentMethodbyid')
	Route.get('/usertransaction/:id', 'TransactionController.usertransaction')
	Route.post('/join/:id', 'MatchController.join')
	Route.post('/addwallet', 'TransactionController.index')
	Route.post('/withdrawwallet', 'TransactionController.withdrawwallet')
	Route.post('/order', 'OrderController.eventorder')
	Route.post('/packageorder', 'OrderController.package')
	Route.get('/offerproduct', 'ProductController.offerproduct')
	Route.get('/myorder/:id', 'OrderController.show')
	Route.get('/offerorder/:id', 'OrderController.offerorder')
	Route.get('/pendingorder/:id', 'OrderController.pendingorder')
	Route.get('/leaderboard', 'UserController.leaderboard')

	Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
	Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
	Route.post('password/reset', 'Auth/PasswordResetController.reset')
}).prefix('api')
