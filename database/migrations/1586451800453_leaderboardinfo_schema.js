'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LeaderboardinfoSchema extends Schema {
  up () {
    this.create('leaderboardinfos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('leaderboardinfos')
  }
}

module.exports = LeaderboardinfoSchema
