'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with orders
 */
const Order = use('App/Models/Order');
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
		const order = await Order.query().with('user').with('topuppackage').orderBy('id', 'desc').paginate(page,10)
		return view.render('/Order/index',{orders: order.toJSON()});
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
		const order = new Eventorder(); 
		order.product_id=request.input('product_id')
		order.user_id=request.input('user_id')
		order.amount=request.input('amount')
		order.date=request.input('date')
		order.active=1
		order.selected=0
		await order.save()
		return 'success';
	}

	async eventorder1 ({view, request, response }){
		const page = request.get().page || 1
		let eventorder = await Eventorder.query().where('active',0).where('selected',1).paginate(page,10);
		let selectedorder = await Eventorder.query().where('active',0).where('selected',1).fetch();
		return view.render('/Order/eventorder',{eventorder: eventorder.toJSON(),selectedorder: selectedorder.rows})
	}

	async pendingorder ({params}){
		const ddd = await Order.query().with('paymentmathod').where('user_id',params.id).where('status','pending').first();
		return ddd
	}

	async package ({ request, response }) {

		let user_id= request.input('user_id')
		return user_id;
		let amount= request.input('amount')

		const ddd = await Order.query().where('user_id',user_id).where('status','pending').getCount();
		if(ddd>0){
			response.json('You Have Already A Pending Order. Please Completed To Add Another Order');
		}else{

			const user = await User.find(user_id);
			let wallet = user.wallet;
			if((wallet+user.earn_wallet)>=amount){

				if(wallet-amount>=0){
					user.wallet=user.wallet-amount
					user.matchesplayed=user.matchesplayed+1
					user.save();
				}else{
					user.wallet=0;
					let current = amount-wallet;
					user.matchesplayed=user.matchesplayed+1
					user.earn_wallet=user.earn_wallet-current;
					user.save();
				}

				const order = new Order(); 
				order.topuppackage_id=request.input('topuppackage_id')
				order.user_id=user_id
				order.playerid=request.input('playerid')
				order.phone=request.input('emailaddress')
				order.status=request.input('status')
				order.amount=amount
				order.payment_mathod=request.input('payment_mathod')
				await order.save()
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
		const transaction = await Order.find(id);
		var status = request.input('status')
		if(status=='cancle'){
			let user = await User.find(transaction.user_id);
			user.wallet=transaction.amount
			await user.save()
		}
		transaction.status=status;
		await transaction.save();
		return response.redirect('/orders');
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
