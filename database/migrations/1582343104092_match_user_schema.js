'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MatchUserSchema extends Schema {
  up () {
    this.create('match_users', (table) => {
      table.increments()
			table.integer('match_id')
			table.integer('user_id')
			table.integer('total_kill').default(0)
			table.integer('total_earn').default(0)
			table.string('gamename').default(0)
			table.string('gameid').default(0)
			table.timestamps()
    })
  }

  down () {
    this.drop('match_users')
  }
}

module.exports = MatchUserSchema
