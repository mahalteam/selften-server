'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventorderSchema extends Schema {
  up () {
    this.create('eventorders', (table) => {
      table.increments()
      table.integer('product_id')
      table.integer('user_id')
      table.float('amount')
      table.date('date')
      table.integer('active')
      table.integer('selected')
      table.timestamps()
    })
  }

  down () {
    this.drop('eventorders')
  }
}

module.exports = EventorderSchema
