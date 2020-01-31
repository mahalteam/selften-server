'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {

	matches () {
	    return this.hasMany('App/Models/Match')
	}
}

module.exports = Product
