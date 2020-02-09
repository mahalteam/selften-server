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
      table.time('start_time',[6])
      table.time('in_time', [6])
      table.time('end_time', [6])
      table.string('match_name')
      table.integer('perkill')
      table.integer('entryfee')
      table.integer('type')
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
