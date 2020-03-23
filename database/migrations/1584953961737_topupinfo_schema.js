'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TopupinfoSchema extends Schema {
  up () {
    this.create('topupinfos', (table) => {
      table.increments()
      table.text('content')
      table.text('banner')
      table.timestamps()
    })
  }

  down () {
    this.drop('topupinfos')
  }
}

module.exports = TopupinfoSchema
