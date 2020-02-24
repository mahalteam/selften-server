'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Match extends Model {
	product () {
	    return this.belongsTo('App/Models/Product')
	}

	users () {
	    return this.belongsToMany('App/Models/User').pivotTable('match_users').withPivot(['gamename','gameid','total_kill','total_earn'])
	}

	prizes () {
	    return this.hasMany('App/Models/Prize')
	}

	map(){
		return this.belongsTo('App/Models/Map')
	}
}

module.exports = Match
