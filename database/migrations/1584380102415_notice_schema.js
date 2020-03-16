'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NoticeSchema extends Schema {
  up () {
    this.create('notices', (table) => {
      table.increments()
      table.text('notice')
      table.timestamps()
    })
  }

  down () {
    this.drop('notices')
  }
}

module.exports = NoticeSchema
