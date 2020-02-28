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

Route.group(() => {
    Route.get('/register', 'AdminController.registerview')
    Route.post('/registerstore', 'AdminController.register').validator('Register')
    // Route.post('/registerstore', 'AuthController.register')
    Route.get('/loginview', 'AdminController.loginview')
    Route.post('/login', 'AdminController.login')
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
	Route.get('/transactionEdit/:id', 'TransactionController.edit')
	Route.post('/transactionUpdate/:id', 'TransactionController.update')
	Route.resource('product', 'ProductController');
	Route.resource('match', 'MatchController');
	Route.resource('map', 'MapController');
	Route.resource('banner', 'BannerController');
	Route.resource('prize', 'PrizeController');
	Route.resource('paymentMethod', 'PaymentMethodController');
})

// api
Route.group(() => {
	Route.post('/register', 'AuthController.register')
	Route.post('/login', 'AuthController.login')
	Route.get('/updateuser/:id', 'AuthController.updateuser')
	Route.get('/matchproduct', 'ProductController.matchproduct')
	Route.get('/match/:id', 'MatchController.matchbyid')
	Route.get('/match/', 'MatchController.matchbyid')
	Route.get('/singlematch/:id', 'MatchController.singlematch')
	Route.get('/paymentMethod', 'PaymentMethodController.paymentMethod')
	Route.get('/paymentMethod/:id', 'PaymentMethodController.paymentMethodbyid')
	Route.get('/usertransaction/:id', 'TransactionController.usertransaction')
	Route.post('/join/:id', 'MatchController.join')
	Route.post('/addwallet', 'TransactionController.index')
}).prefix('api')
