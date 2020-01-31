'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BannerSchema extends Schema {
  up () {
    this.create('banners', (table) => {
      table.increments()
      table.string('note')
      table.string('banner')
      table.integer('isactive').default(0);
      table.timestamps()
    })
  }

  down () {
    this.drop('banners')
  }
}

module.exports = BannerSchema
