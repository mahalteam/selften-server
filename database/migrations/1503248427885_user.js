'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable()
      table.string('account_status', 80).notNullable()
      table.integer('is_admin').default(0)
      table.string('phone', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('wallet', 10).default(0)
      table.integer('earn_wallet', 10).default(0)
      table.integer('scores', 10).default(0)
      table.integer('matchesplayed', 10).default(0)
      table.integer('totalkills', 10).default(0)
      table.integer('propoints', 10).default(0)
      table.integer('winamounts', 10).default(0)
      table.float('leaderboard', 10).default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
