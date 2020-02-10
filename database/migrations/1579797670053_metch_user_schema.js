'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MetchUserSchema extends Schema {
	up () {
		this.create('metch_users', (table) => {
			table.increments()
			table.integer('metch_id')
			table.integer('user_id')
			table.integer('totalkill')
			table.string('gamename')
			table.string('gameid')
			table.timestamps()
		})
	}

	down () {
		this.drop('metch_users')
	}
}

module.exports = MetchUserSchema
