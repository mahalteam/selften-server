'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with paymentmethods
 */
const Drive = use('Drive');
const { validate } = use('Validator');
const PaymentMethod = use('App/Models/PaymentMethod')
const Helpers = use('Helpers');
class PaymentMethodController {
  /**
   * Show a list of all paymentmethods.
   * GET paymentmethods
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const paymentMethod = await PaymentMethod.all();
    return view.render('Setup/paymentMethod/index',
			{
			    paymentMethods: paymentMethod.rows,
			}
		);
  }

  /**
   * Render a form to be used for creating a new paymentmethod.
   * GET paymentmethods/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new paymentmethod.
   * POST paymentmethods
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, session }) {
    const rules = {
			name: 'required',
			// logo: 'required',
			info: 'required',
		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			session
				.withErrors(validation.messages())
				.flashExcept()
        console.log(validation.messages())
				return response.redirect('back')
      }
      
    const fileName = await this._uploadLogo(request);
		const paymentMethod = new PaymentMethod()

		paymentMethod.name = request.input('name')
    paymentMethod.logo = fileName
    paymentMethod.info = request.input('info');
    paymentMethod.status = 1;

		await paymentMethod.save()
		return response.redirect('paymentMethod');
  }

  async paymentMethod ({ params, request, response, view }) {
    const paymentMethod = await PaymentMethod.all();
    return response.send(paymentMethod);
  }

  /**
   * Display a single paymentmethod.
   * GET paymentmethods/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing paymentmethod.
   * GET paymentmethods/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    const id = params.id;
		// Console.log(id);
		const paymentMethod = await PaymentMethod.find(id);
		return paymentMethod;
  }

  /**
   * Update paymentmethod details.
   * PUT or PATCH paymentmethods/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const paymentMethod = await PaymentMethod.find(params.id);
		if (!paymentMethod){
			return "No paymentMethod for this id";
		}
		const rules = {
			name: 'required',
      info: 'required',
			status: 'required'
		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			return "Insert Form data error";
		}

		const fileName = await this._uploadLogo(request);
		paymentMethod.name = request.input('name')
    paymentMethod.info = request.input('info');
    paymentMethod.status = request.input('status');
		if (fileName) {
			await Drive.delete(`${Helpers.appRoot()}/uploads/payment/${paymentMethod.logo}`)
      paymentMethod.logo = fileName;
      // return "hello";
		}

		await paymentMethod.save();
		return response.redirect('/paymentMethod');
  }

  /**
   * Delete a paymentmethod with id.
   * DELETE paymentmethods/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const paymentMethod = await PaymentMethod.find(params.id)
        if (!paymentMethod) {
            return "No paymentMethod for this id";
        }
        await Drive.delete(`${Helpers.appRoot()}/public/uploads/payment/${paymentMethod.logo}`);
        await paymentMethod.delete();
        return response.redirect('/paymentMethod');
  }

  async _uploadLogo (request) { // this function is using for logo upload. This receive request as paramiter from request controller
		const unixTime  = Date.now();
		const profilePic = request.file('logo', {
			types: ['image'],
			size: '1mb'
    })
    
    // return profilePic;

		if (!profilePic) {
			this.uploadError = "No file";
			return false;
		}

		const fileName = `${unixTime}_logo.${profilePic.extname}`;
		await profilePic.move(Helpers.appRoot('public/uploads/payment'), {
			name: fileName
		})
	
		if (!profilePic.moved()) {
			this.uploadError = profilePic.error();
			return false;
		}
		return fileName;
  }
  
}

module.exports = PaymentMethodController
