'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MatchSchema extends Schema {
  up () {
    this.create('matches', (table) => {
      table.increments()
      table.integer('product_id')
      table.integer('map_id')
      table.date('start_at')
      table.string('start_time')
      table.string('match_name')
      table.integer('perkill')
      table.integer('entryfee')
      table.string('type')
      table.enu('status',['upcoming','ongoing','result'])
      table.integer('max_join')
      table.integer('min_join')
      table.string('room_id')
      table.string('password')
      table.text('total_prize')
      table.text('platform')
      table.timestamps()
    })
  }

  down () {
    this.drop('matches')
  }
}

module.exports = MatchSchema
