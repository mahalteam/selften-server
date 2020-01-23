'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('wallet', 10).default(0).unique()
      table.integer('scores', 10).default(0).unique()
      table.integer('matchesplayed', 10).default(0).unique()
      table.integer('totalkills', 10).default(0).unique()
      table.integer('winamounts', 10).default(0).unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
