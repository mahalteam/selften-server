'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BulkstockinfoSchema extends Schema {
  up () {
    this.create('bulkstockinfos', (table) => {
      table.increments()
      table.integer('product_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('bulkstockinfos')
  }
}

module.exports = BulkstockinfoSchema
