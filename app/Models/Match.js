'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Match extends Model {
	product () {
	    return this.belongsTo('App/Models/Product')
	}

	users () {
	    return this.belongsToMany('App/Models/User')
	}
}

module.exports = Match
