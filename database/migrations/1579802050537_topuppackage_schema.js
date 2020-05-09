'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TopuppackageSchema extends Schema {
  up () {
    this.create('topuppackages', (table) => {
      table.increments()
      table.integer('product_id')
      table.string('name')
      table.float('price')
      table.float('bprice')
      table.timestamps()
    })
  }

  down () {
    this.drop('topuppackages')
  }
}

module.exports = TopuppackageSchema
