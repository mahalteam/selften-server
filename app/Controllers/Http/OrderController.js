'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with orders
 */
const Order = use('App/Models/Order');
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
		return view.render('/Order/index',{orders: order.toJSON()}
		);
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
	async store ({ request, response }) {
		const order = new Order(); 
		order.product_id=request.input('product_id')
		order.user_id=request.input('user_id')
		order.amount=request.input('amount')
		order.date=request.input('date')
		// await order.save()
		return 'success';
	}

	async OrderUpdate ({ request, response }){

	}

	async package ({ request, response }) {

		let user_id= request.input('user_id')
		let amount= request.input('amount')

		const ddd = await Order.query().where('user_id',user_id).where('status','pending').getCount();
		if(ddd>0){
			response.json('You Have Already A Pending Order. Please Completed To Add Another Order');
		}else{
			const order = new Order(); 
			order.topuppackage_id=request.input('topuppackage_id')
			order.user_id=user_id
			order.playerid=request.input('playerid')
			order.status=request.input('status')
			order.amount=request.input('amount')
			order.payment_mathod=request.input('payment_mathod')
			await order.save()
			return 'success';
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
