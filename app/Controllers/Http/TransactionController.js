'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Transaction = use('App/Models/Transaction');
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
		transaction.number=request.input('user_id')
		transaction.paymentmethod_id=request.input('paymentmethod')
		transaction.status='pending'
		transaction.save();
		response.json('success');
	}

	async usertransaction({ params,request, response, view }){
		const transaction= Transaction.find(params.id);
		response.json(transaction);
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
    const transaction = await Database.table('transactions').orderBy('id', 'desc');
    // return transaction;
    return view.render('Setup/transaction/index',
			{
			    transactions: transaction,
			}
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
    transaction.status = request.input('status')

    await transaction.save();
		return response.redirect('/transaction');
  }
	
}

module.exports = TransactionController
