'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MapSchema extends Schema {
  up () {
    this.create('maps', (table) => {
      table.increments()
      table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('maps')
  }
}

module.exports = MapSchema
