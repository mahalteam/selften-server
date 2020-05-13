'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with orders
 */
const Order = use('App/Models/Order');
const Product = use('App/Models/Product');
const User = use('App/Models/User');
const Eventorder = use('App/Models/Eventorder');
class OrderController {
	/**
	 * Show a list of all orders.
	 * GET orders
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const page = request.get().page || 1
		const user_id = request.get().user_id;
		let order = [] ; 
		if(user_id){
			order = await Order.query().with('user').with('topuppackage').where('user_id',user_id).paginate(page,10);
		}else{
		 	order = await Order.query().with('user').with('topuppackage').orderBy('id', 'desc').paginate(page,10)
		}
		return view.render('/Order/index',{orders: order.toJSON()});
	}

	async genarate({ request, response, view }) {

		const ddd = await Eventorder.query().where('selected',0).where('active',1).fetch();

		let seleted = ddd.rows[Math.floor(Math.random() * ddd.rows.length-1) + 1];

		seleted.selected=1;
		seleted.active=2;
		await seleted.save();

		response.redirect('/eventorder');
	}

	async close({ request, response, view }) {

		const ddd = await Eventorder.query().where('active',1).where('selected',0).fetch();

		ddd.rows.forEach(this.updateforclose);

		let ddd1 = await Eventorder.query().where('active',2).where('selected',1).fetch();

		ddd1.rows.forEach(this.updateforclose1);


		response.redirect('/eventorder');
	}

	async updateforclose(item, index) {
		let user = await User.find(item.user_id);
		let product = await Product.find(item.product_id);
		user.wallet=user.wallet+product.price
		await user.save();

		const ddd = await Eventorder.find(item.id);
		ddd.active=0;
		await ddd.save();
	  	return item;
	}


	async updateforclose1(item, index) {
		let ddd1 = await Eventorder.find(item.id);
		ddd1.active=0;
		await ddd1.save();
	  	return item;
	}

	/**
	 * Render a form to be used for creating a new order.
	 * GET orders/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create ({ request, response, view }) {
	}
 
	/**
	 * Create/save a new order.
	 * POST orders
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async eventorder ({ request, response }) {

		let user_id= request.input('user_id')
		let amount= request.input('amount')
		// const ddd = await Eventorder.query().where('user_id',user_id).where('active',1).getCount();
		const ddd=0;
		if(ddd>0){
			response.json('You Have Already A Pending Order. Please Completed To Add Another Order');
		}else{
			const user = await User.find(user_id);
			let wallet = user.wallet;
			if((wallet+user.earn_wallet)>=amount){

			if(wallet-amount>=0){
				user.wallet=user.wallet-amount
				user.save();
			}else{
				user.wallet=0;
				let current = amount-wallet;
				user.earn_wallet=user.earn_wallet-current;
				user.save();
			}
			const order = new Eventorder(); 
			order.product_id=request.input('product_id')
			order.user_id=user_id
			order.amount=amount
			order.playerid=request.input('playerid')
			order.active=1
			order.selected=0
			await order.save()
			return 'success';
			}
			else{
				response.json('faliled')
			}
		}
	}

	async eventorder1 ({view, request, response }){
		const page = request.get().page || 1
		let eventorder = await Eventorder.query().with('user').where('active',1).where('selected',0).paginate(page,10);
		let selectedorder = await Eventorder.query().with('user').where('active',2).where('selected',1).fetch();
		return view.render('/Order/eventorder',{eventorder: eventorder.toJSON(),selectedorder: selectedorder.toJSON()})
	}

	async pendingorder ({params}){
		const ddd = await Order.query().with('paymentmathod').with('topuppackage').where('user_id',params.id).where('status','pending').first();
		return ddd
	}

	async topup_packageorder ({ request, response }) {

		let user_id= request.input('user_id')
		let amount= request.input('amount')
		let bprice= request.input('bprice')

		let product = await Product.find(request.input('product_id'));

		// const ddd = await Order.query().where('user_id',user_id).where('status','pending').getCount();
		const ddd  = 0;
		if(ddd>0){
			response.json('You Have Already A Pending Order. Please Completed To Add Another Order');
		}
		else if(bprice>product.price){
			response.json('StockOut');
		}
		else{

			product.price=product.price-bprice;
			await product.save();

			const user = await User.find(user_id);
			let wallet = user.wallet;
			if((wallet+user.earn_wallet)>=amount){

				if(wallet-amount>=0){
					user.wallet=user.wallet-amount
					user.save();
				}else{
					user.wallet=0;
					let current = amount-wallet;
					user.earn_wallet=user.earn_wallet-current;
					user.save();
				}

				const order = new Order(); 
				order.topuppackage_id=request.input('topuppackage_id')
				order.name=request.input('name')
				order.accounttype=request.input('accounttype')
				order.product_id=request.input('product_id')
				order.ingameid=request.input('ingameid')
				order.ingamepassword=request.input('ingamepassword')
				order.user_id=user_id
				order.playerid=request.input('playerid')
				order.phone=request.input('emailaddress')
				order.status=request.input('status')
				order.amount=amount
				order.bprice=bprice
				order.payment_mathod=request.input('payment_mathod')
				await order.save()
				order.topuppackage;
				return order;

			}else{
				response.json('faliled')
			}
		}
	}


	/**
	 * Display a single order.
	 * GET orders/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show ({ params, request, response, view }) {
		const ddd = await Order.query().where('user_id',params.id).orderBy('id','desc').limit(50).fetch();
		return ddd;
	}

	async offerorder ({ params, request, response, view }) {
		const ddd = await Eventorder.query().where('user_id',params.id).orderBy('id','desc').limit(50).fetch();
		return ddd;
	}

	/**
	 * Render a form to update an existing order.
	 * GET orders/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
		const id = params.id;
		// Console.log(id);
		const transaction = await Order.find(id);
		return transaction;
	}

	/**
	 * Update order details.
	 * PUT or PATCH orders/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {
		const id = await params.id;
		let transaction = await Order.find(id);
		let product = await Product.find(transaction.product_id);
		var status = request.input('status')
		if(status=='cancel'){
			product.price=product.price+transaction.bprice
			await product.save()
			let user = await User.find(transaction.user_id);
			user.wallet=user.wallet+transaction.amount
			await user.save()
		}
		transaction.status=status;
		await transaction.save();
		return response.redirect('back');
	}

	/**
	 * Delete a order with id.
	 * DELETE orders/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, request, response }) {
	}
}

module.exports = OrderController
