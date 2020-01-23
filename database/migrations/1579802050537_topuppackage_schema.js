'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TopuppackageSchema extends Schema {
  up () {
    this.create('topuppackages', (table) => {
      table.increments()
      table.string('name')
      table.integer('amount')
      table.timestamps()
    })
  }

  down () {
    this.drop('topuppackages')
  }
}

module.exports = TopuppackageSchema
