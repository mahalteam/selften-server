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
	Route.get('/cancelalltransaction', 'TransactionController.cancelalltransaction')
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


Route.get('/au/:provider', 'Auth/LoginController.redirectToProvider').as('social.login')
Route.get('/aur/:provider', 'Auth/LoginController.handleProviderCallback').as('social.login.callback')

// Route
//   .group(() => {
//     Route.get('users', async ({ subdomains }) => {
//       return `The username is ${subdomains.user}`
//     })
//   })
//   .domain('http://selften.com/')

// api
Route.group(() => {
	Route.post('/register', 'AuthController.register1')
	Route.post('/login', 'AuthController.login')
	Route.post('loginbyid/:id/:providerid', 'AuthController.loginbyid')
	Route.post('/forgotpassword', 'AuthController.forgotPassword')
	Route.get('/updateuser/:id', 'AuthController.updateuser')
	Route.get('/matchproduct', 'ProductController.matchproduct')
	Route.get('/topupproduct', 'ProductController.topupproduct')
	Route.get('/notice', 'NoticeController.all')
	Route.get('/topupinfo', 'TopupinfoController.show')
	Route.get('/leaderbordinfo', 'LeaderboardinfoController.all')
	Route.get('/topuppackage', 'TopuppackageController.all1') //will deletew
	Route.get('/topuppackage/:id', 'TopuppackageController.all')
	Route.get('/banner', 'BannerController.all')
	Route.get('/match/:id', 'MatchController.matchbyid')
	Route.get('/match/', 'MatchController.matchbyid')
	Route.get('/matchs/:status/:id1', 'MatchController.matchbystatus')
	Route.get('/singlematch/:id', 'MatchController.singlematch')
	Route.get('/paymentMethod', 'PaymentMethodController.paymentMethod')
	Route.get('/paymentMethod/:id', 'PaymentMethodController.paymentMethodbyid')
	Route.get('/usertransaction/:id', 'TransactionController.usertransaction')
	Route.post('/join/:id', 'MatchController.join')
	Route.post('/addwallet', 'TransactionController.index')
	Route.post('/change/:id', 'UserController.change')
	Route.post('/withdrawwallet', 'TransactionController.withdrawwallet')
	Route.post('/order', 'OrderController.eventorder')
	Route.post('/packageorder', 'OrderController.topup_packageorder').middleware(['auth'])
	Route.get('/offerproduct', 'ProductController.offerproduct')
	Route.get('/myorder/:id', 'OrderController.show')
	Route.get('/offerorder/:id', 'OrderController.offerorder')
	Route.get('/pendingorder/:id', 'OrderController.pendingorder')
	Route.get('/leaderboard', 'UserController.leaderboard')

	Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
	Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
	Route.post('password/reset', 'Auth/PasswordResetController.reset')

	// home
	Route.get('countsamary', 'HomeController.countsection')

	// shop
	Route.get('/shopproduct', 'ProductController.shopproduct')

	Route.get('login/facebook', 'Auth/LoginController.redirect')
	Route.get('facebook/callback', 'Auth/LoginController.callback')

	Route.get('login/google', 'Auth/LoginController.redirectg')
	Route.get('google/callback', 'Auth/LoginController.callbackg')



	// mobile app 
	Route.get('/appmatchproduct', 'ProductController.matchproductforapp')
	Route.get('/appmatchs/:status/:id1', 'MatchController.matchbystatusapp')
	Route.get('appuerbyid/:id', 'AuthController.updateuserapp')
	Route.get('/apppaymentMethod', 'PaymentMethodController.paymentMethod1')
	Route.get('/apppaymentMethod/:id', 'PaymentMethodController.paymentMethodbyid1')
	Route.get('/appusertransaction/:id', 'TransactionController.usertransactionapp')
	Route.post('/appjoin/:id', 'MatchController.join')
	Route.post('/appaddwallet', 'TransactionController.index')
	Route.get('/matchdata/:userid/:matchid', 'MatchController.matchdata')
	Route.get('/appinfo', 'AdminController.appinfo')
	Route.post('/appjoin/:id', 'MatchController.join')


}).prefix('api')


