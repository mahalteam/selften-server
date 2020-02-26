'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionSchema extends Schema {
	up () {
		this.create('transactions', (table) => {
			table.increments()
			table.integer('user_id')
			table.integer('amount')
			table.integer('paymentmethod_id')
			table.string('status')
			table.string('purpose')
			table.string('number')
			table.timestamps()
		})
	}

	down () {
		this.drop('transactions')
	}
}

module.exports = TransactionSchema
