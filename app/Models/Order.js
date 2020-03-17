'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
	user () {
	    return this.belongsTo('App/Models/User')
	}

	topuppackage () {
	    return this.belongsTo('App/Models/Topuppackage')
	}
}

module.exports = Order
