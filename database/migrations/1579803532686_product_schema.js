'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
	up () {
		this.create('products', (table) => {
			table.increments()
			table.string('name');
			table.string('logo');
			table.float('price').nullable();
			table.float('offer_price').nullable();
			table.datetime('start_at').nullable();
			table.datetime('end_at').nullable();
			table.text('rules');
			table.integer('isactiveforsale').default(0);
			table.integer('isactiveformatch').default(0);
			table.integer('isactivefortopup').default(0);
			table.timestamps()
		})
	}

	down () {
		this.drop('products')
	}
}

module.exports = ProductSchema
