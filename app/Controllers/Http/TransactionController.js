'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Transaction = use('App/Models/Transaction');
const User = use('App/Models/User');
const Database = use('Database')
/**
 * Resourceful controller for interacting with transactions
 */
class TransactionController {
	/**
	 * Show a list of all transactions.
	 * GET transactions
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const transaction= new Transaction();
		transaction.user_id=request.input('user_id')
		transaction.purpose=request.input('purpose')
		transaction.amount=request.input('amount')
		transaction.number=request.input('number')
		transaction.paymentmethod_id=request.input('paymentmethod')
		transaction.status='pending'
		transaction.save();
		response.json('success');
	}

	async usertransaction({ params,request, response, view }){
		const transaction= await Transaction.query().where('user_id',params.id).orderBy('id', 'desc').limit(15).fetch();
		response.send(transaction);
	}


	async show ({ request, response, view }) {
		const transaction = await Transaction.all();
		return view.render('Setup/transaction/index',
			{
				transactions: transaction.rows,
			}
		);
	}

	/**
	 * Create/save a new transaction.
	 * POST transactions
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store ({ request, response, view }) {
		const page = request.get().page || 1
		const transaction = await Transaction.query().orderBy('id', 'desc').paginate(page,10)
		return view.render('Setup/transaction/index',{transactions: transaction.toJSON()}
		);
	}

	/**
	 * Render a form to update an existing transaction.
	 * GET transactions/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
		const id = params.id;
		// Console.log(id);
		const transaction = await Transaction.find(id);
		return transaction;
	}

	/**
	 * Update transaction details.
	 * PUT or PATCH transactions/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {
		const id = await params.id;
		const transaction = await Transaction.find(id);
		var status = request.input('status')
		var old_status = request.input('old_status')

		if(status=='completed' && transaction.purpose=='addwallet'){

			if(old_status!='completed'){
				let user = await User.find(transaction.user_id);
				user.wallet=parseInt(user.wallet)+parseInt(transaction.amount)
				await user.save();
			}

		}

		if((status=='padding' || status=='cancel') && transaction.purpose=='addwallet'){
			if(old_status=='completed'){
				let user = await User.find(transaction.user_id);
				user.wallet=user.wallet-transaction.amount
				await user.save();
			}
		}

		// if(status=='completed' && transaction.purpose=='withdraw'){
		// 	if(old_status!='completed'){
		// 		let user = await User.find(transaction.user_id);
		// 		user.earn_wallet=user.earn_wallet-transaction.amount
		// 		await user.save();
		// 	}
		// }
		if(status=='cancel' && transaction.purpose=='withdraw'){
			if(old_status=='completed'){
				let user = await User.find(transaction.user_id);
				user.wallet=user.wallet+transaction.amount
				await user.save();
			}
		}

		transaction.status=status;
		await transaction.save();
		return response.redirect('/transaction');
	}
	
}

module.exports = TransactionController
