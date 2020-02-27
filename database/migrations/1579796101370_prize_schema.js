'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PrizeSchema extends Schema {
  up () {
    this.create('prizes', (table) => {
      table.increments()
      table.integer('match_id')
      table.integer('match_user_id')
      table.integer('lavel')
      table.integer('prize')
      table.timestamps()
    })
  }

  down () {
    this.drop('prizes')
  }
}

module.exports = PrizeSchema
