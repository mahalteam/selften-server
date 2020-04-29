'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
	up () {
		this.create('orders', (table) => {
			table.increments()
			table.integer('product_id')
			table.string('phone')
			table.text('name')
			table.text('ingameid').nullable();
			table.text('ingamepassword').nullable();
			table.integer('playerid')
			table.integer('topuppackage_id')
			table.enu('status',['pending','completed','cancel'])
			table.integer('user_id')
			table.float('amount')
			table.date('date')
			table.timestamps()
		})
	}

	down () {
		this.drop('orders')
	}
}

module.exports = OrderSchema
