'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with topupinfos
 */
const Topupinfo = use('App/Models/Topupinfo')
const Helpers = use('Helpers');
const Drive = use('Drive');

class TopupinfoController {
	/**
	 * Show a list of all topupinfos.
	 * GET topupinfos
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const topupinfo = await Topupinfo.all();

		return view.render('Setup/topupinfo/index',{topupinfo: topupinfo.rows});
	}

	
	async all ({ request, response, view }){
		const topuppackages = await Topupinfo.all();
		response.send(topuppackages);
		return
	}

	async create ({ request, response, view }) {
		return view.render('Setup.topupinfo.create');
	}

	async store ({ request, response }) {

		const fileName = await this._uploadLogo(request);


		const topuppackages = new Topupinfo()
		topuppackages.content = request.input('content')
		topuppackages.banner = fileName
		await topuppackages.save()
		return response.redirect('/topupinfo');
	}

	
	/**
	 * Display a single topupinfo.
	 * GET topupinfos/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show ({ params, request, response, view }) {
		const topupinfo = await Topupinfo.all();
		return topupinfo;
	}

	/**
	 * Render a form to update an existing topupinfo.
	 * GET topupinfos/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
		const topuppackages = await Topupinfo.find(params.id);
		return view.render('Setup.topupinfo.edit',{topuppackages: topuppackages});
	}

	/**
	 * Update topupinfo details.
	 * PUT or PATCH topupinfos/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {

		const topuppackages = await Topupinfo.find(params.id);
		if (!topuppackages){
				return "No Topuppackage for this id";
		}
		const fileName = await this._uploadLogo(request);
		topuppackages.content = request.input('content')
		topuppackages.banner = fileName
		await topuppackages.save();

		return response.redirect('/topupinfo');

	}

	/**
	 * Delete a topupinfo with id.
	 * DELETE topupinfos/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, request, response }) {
		const topuppackages = await Topupinfo.find(params.id)
		if (!topuppackages) {
				return "No Topuppackage for this id";
		}
		await topuppackages.delete();
		return response.redirect('/topupinfo');
	}

	async _uploadLogo (request) { // this function is using for logo upload. This receive request as paramiter from request controller
		const unixTime  = Date.now();
		const profilePic = request.file('banner', {
			types: ['image'],
			size: '1mb'
		})

		if (!profilePic) {
			this.uploadError = "No file";
			return false;
		}

		const fileName = `${unixTime}_logo.${profilePic.extname}`;
		await profilePic.move(Helpers.appRoot('public/uploads/topupinfo'), {
			name: fileName
		})
	
		if (!profilePic.moved()) {
			this.uploadError = profilePic.error();
			return false;
		}
		return fileName;
	}
}

module.exports = TopupinfoController
