'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MetchUserSchema extends Schema {
	up () {
		this.create('metch_users', (table) => {
			table.increments()
			table.integer('metch_id')
			table.integer('user_id')
			table.integer('total_kill').default(0)
			table.integer('total_earn').default(0)
			table.string('gamename').default(0)
			table.string('gameid').default(0)
			table.timestamps()
		})
	}

	down () {
		this.drop('metch_users')
	}
}

module.exports = MetchUserSchema
