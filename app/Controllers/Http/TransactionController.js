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
		let purpose= request.input('purpose')
		let user_id= request.input('user_id')
		let amount= request.input('amount')

		if(user_id && amount>0){
			const dd = await Transaction.query().where('user_id',user_id).where('status','pending').getCount();
			if(dd>0){
				response.json('You Have Already A Pending Order. Please Completed To Add Another Order');
			}else{
				const transaction= new Transaction();
				transaction.user_id=user_id
				transaction.purpose=purpose;
				transaction.amount=request.input('amount')
				transaction.number=request.input('number')
				transaction.paymentmethod_id=request.input('paymentmethod')
				transaction.status='pending'
				await transaction.save();
				response.json('success');
				return
			}
		}else{
			response.json('Please Refresh The Page And Send Again');
		}
	}

	async withdrawwallet({ request, auth, response, view }){
		let purpose= request.input('purpose')
		// let user_id= request.input('user_id')
		let user_id= await auth.current.user.id
		let amount= request.input('amount')

		if(user_id && amount>0){
			const dd = await Transaction.query().where('user_id',user_id).where('status','pending').getCount();
			if(dd>0){
				response.json('You Have Already A Pending Order. Please Completed To Add Another Order');
			}else{
				const transaction= new Transaction();
				const user = await User.find(user_id);
				if(user.earn_wallet>=amount){
					transaction.user_id=user_id
					transaction.purpose=purpose;
					transaction.amount=request.input('amount')
					transaction.number=request.input('number')
					transaction.paymentmethod_id=request.input('paymentmethod')
					transaction.status='pending'
					await transaction.save();
					user.earn_wallet=user.earn_wallet-amount
					await user.save()
				}else{
					response.json('You do not have enough balance');
					return 
				}
				response.json('success');
				return
			}
		}else{
			response.json('Please Refresh The Page And Send Again');
		}
	}

	async usertransaction({ params,request, response, view }){
		const transaction= await Transaction.query().where('user_id',params.id).orderBy('id', 'desc').limit(50).fetch();
		response.send(transaction);
	}

	async usertransactionapp({ params,request, response, view }){
		const transaction= await Transaction.query().where('user_id',params.id).orderBy('id', 'desc').limit(50).fetch();
		response.send({result:transaction});
	}

	async cancelalltransaction({request, response, view}){
		const transaction= await Transaction.query().where('status','pending').where('purpose','addwallet').update({ status: 'cancel' });
		return response.redirect('back');
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
		const number = request.get().number;
		const user_id = request.get().user_id;
		let transaction=[];
		if(number){
			transaction= await Transaction.query().with('payment_method').where('number',number).orderBy('id', 'desc').fetch()
		}else if(user_id){
			transaction= await Transaction.query().with('payment_method').where('user_id',user_id).orderBy('id', 'desc').fetch()
		}else{
			transaction = await Transaction.query().with('payment_method').orderBy('id', 'desc').where('purpose','addwallet').paginate(page,10)
		}
		return view.render('Setup/transaction/index',{transactions: transaction.toJSON()});
		
	}

	async transactionwithdraw ({ request, response, view }) {
		const page = request.get().page || 1
		const number = request.get().number;
		let transaction=[];
		if(number){
			transaction= await Transaction.query().with('payment_method').where('number',number).fetch()
			return view.render('Setup/transaction/index',{transactions: transaction.toJSON()})
		}else{
			transaction = await Transaction.query().with('payment_method').orderBy('id', 'desc').where('purpose','withdraw').paginate(page,10)
		}
		return view.render('Setup/transaction/index1',{transactions: transaction.toJSON()});
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

	async updatewitdrwo ({ params, request, response }) {
		const id = await params.id;
		const transaction = await Transaction.find(id);
		var status = request.input('status')
		var page = request.input('page')
		var old_status = request.input('old_status')

		if(status=='cancel' && transaction.purpose=='withdraw'){
			if(old_status=='completed' || old_status=='pending'){
				let user = await User.find(transaction.user_id);
				user.earn_wallet=user.earn_wallet+transaction.amount
				await user.save();
			}
		}

		transaction.status=status;
		await transaction.save();
		return response.redirect('back');
		// return response.redirect('/transactionwithdraw?page='+page);
	}

	async update ({ params, request, response }) {
		const id = await params.id;
		const transaction = await Transaction.find(id);
		var status = request.input('status')
		var old_status = request.input('old_status')

		if(status=='completed' && transaction.purpose=='addwallet' && transaction.status=='pending'){

			if(old_status!='completed'){
				let user = await User.find(transaction.user_id);
				user.wallet=parseInt(user.wallet)+parseInt(transaction.amount)
				await user.save();
			}

		}

		if((status=='pending' || status=='cancel') && transaction.purpose=='addwallet' && transaction.status=='completed'){
			if(old_status=='completed'){
				let user = await User.find(transaction.user_id);
				user.wallet=user.wallet-transaction.amount
				await user.save();
			}
		}

		transaction.status=status;
		await transaction.save();
		return response.redirect('back');
	}
	
}

module.exports = TransactionController
