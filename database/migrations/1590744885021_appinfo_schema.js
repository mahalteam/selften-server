'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppinfoSchema extends Schema {
  up () {
    this.create('appinfos', (table) => {
      table.increments()
      table.string('version_code')
      table.string('version_name')
      table.text('changes')
      table.timestamps()
    })
  }

  down () {
    this.drop('appinfos')
  }
}

module.exports = AppinfoSchema
