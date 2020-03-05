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
	Route.get('/totalplayer/:id', 'MatchController.totalplayer')
	Route.get('/playerupdate/:id', 'MatchController.playerupdate')
	Route.post('/playerUpdateStore', 'MatchController.playerUpdateStore')
	Route.get('/update/:id', 'MatchController.updatestatus')
	Route.get('/transaction', 'TransactionController.store')
	Route.get('/orders', 'OrderController.index')
	Route.get('/transactionEdit/:id', 'TransactionController.edit')
	Route.post('/transactionUpdate/:id', 'TransactionController.update')
	Route.resource('product', 'ProductController');
	Route.resource('match', 'MatchController');
	Route.resource('map', 'MapController');
	Route.resource('banner', 'BannerController');
	Route.resource('prize', 'PrizeController');
	Route.resource('paymentMethod', 'PaymentMethodController');
}).middleware(['auth'])

// api
Route.group(() => {
	Route.post('/register', 'AuthController.register1')
	Route.post('/login', 'AuthController.login')
	Route.post('/forgotpassword', 'AuthController.forgotPassword')
	Route.get('/updateuser/:id', 'AuthController.updateuser')
	Route.get('/matchproduct', 'ProductController.matchproduct')
	Route.get('/banner', 'BannerController.all')
	Route.get('/match/:id', 'MatchController.matchbyid')
	Route.get('/match/', 'MatchController.matchbyid')
	Route.get('/singlematch/:id', 'MatchController.singlematch')
	Route.get('/paymentMethod', 'PaymentMethodController.paymentMethod')
	Route.get('/paymentMethod/:id', 'PaymentMethodController.paymentMethodbyid')
	Route.get('/usertransaction/:id', 'TransactionController.usertransaction')
	Route.post('/join/:id', 'MatchController.join')
	Route.post('/addwallet', 'TransactionController.index')
	Route.post('/order', 'OrderController.store')
	
	Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
	Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
	Route.post('password/reset', 'Auth/PasswordResetController.reset')
}).prefix('api')
