'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Matchuser extends Model {
	static get table () {
	    return 'match_user'
	}
	matches(){
        return this.belongsTo('App/Models/Match', 'match_id');
	}
	users(){
        return this.belongsTo('App/Models/User', 'user_id');
	}
}

module.exports = Matchuser
