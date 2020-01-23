'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MetchUserSchema extends Schema {
	up () {
		this.table('metch_users', (table) => {
			table.increments()
			table.integer('metch_id')
			table.integer('user_id')
			table.integer('totalkill')
			table.timestamps()
		})
	}

	down () {
		this.table('metch_users', (table) => {
			// reverse alternations
		})
	}
}

module.exports = MetchUserSchema
