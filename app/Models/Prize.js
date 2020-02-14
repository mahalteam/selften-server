'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Prize extends Model {
	match () {
	    return this.belongsTo('App/Models/Match')
	}
}

module.exports = Prize
