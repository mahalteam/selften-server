'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Matchuser extends Model {
	static get table () {
	    return 'match_user'
	}
}

module.exports = Matchuser
