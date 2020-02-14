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

Route.get('/', 'HomeController.index')
Route.get('/table', 'HomeController.table')
Route.get('/users', 'UserController.index')
Route.resource('product', 'ProductController');
Route.resource('match', 'MatchController');
Route.resource('map', 'MapController');
Route.resource('banner', 'BannerController');
Route.resource('prize', 'PrizeController');


// api
Route.group(() => {
	Route.post('/register', 'AuthController.register')
	Route.post('/login', 'AuthController.login')
	Route.get('/matchproduct', 'ProductController.matchproduct')
	Route.get('/match/:id', 'MatchController.matchbyid')
	Route.get('/singlematch/:id', 'MatchController.singlematch')
	Route.post('/join/:id', 'MatchController.join')
	Route.post('/addwallet', 'TransactionController.index')
}).prefix('api')
