'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
    // async update (id, data) {
    //     const affectedRows = await Database
    //         .table('products')
    //         .where('id', id)
    //         .update(data)
    // }
}

module.exports = Product
