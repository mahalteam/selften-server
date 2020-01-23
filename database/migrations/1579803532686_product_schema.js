'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
	    table.increments()
	    table.string('name')
	    table.string('logo')
	    table.integer('isactiveforsale')
	    table.integer('isactiveformatch')
	    table.integer('isactivefortopup')
	    table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
