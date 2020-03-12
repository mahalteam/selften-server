'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Transaction extends Model {

	payment_method(){
		return this.belongsTo('App/Models/PaymentMethod','paymentmethod_id')
	}

}

module.exports = Transaction
