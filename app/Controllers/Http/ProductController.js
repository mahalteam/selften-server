'use strict'

const { validate } = use('Validator');
const database = use('Database');

class ProductController {

  async index ({ request, response, view }) {
  }

  async create ({ request, response, view }) {
    return view.render('create_product');
  }

  async store ({ request, response }) {
    const rules = {
      product_name: 'required'
    }
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return "Insert Form data error";
    }

    const unixTime  = Date.now();
    const profilePic = request.file('logo_img', {
      types: ['image'],
      size: '1mb'
    })

    const fileName = `${unixTime}_logo.${profilePic.extname}`;
    await profilePic.move('uploads/logo', {
     name: fileName
    })
  
    if (!profilePic.moved()) {
      return profilePic.error()
    }

    let dbData = {
      name: request.input('product_name'),
      logo: fileName,
      isactiveforsale: request.input('for_sale', 0),
      isactiveformatch: request.input('for_match', 0),
      isactivefortopup: request.input('for_top_up', 0),
      created_at: 'NOW()'
    }
    console.log(await database.table('products').insert(dbData));
    return  "True";
  }

  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing product.
   * GET products/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ProductController
