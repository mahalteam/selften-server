'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with leaderboardinfos
 */
const Leaderboardinfo = use('App/Models/Leaderboardinfo')
const Helpers = use('Helpers');
const Drive = use('Drive');
class LeaderboardinfoController {
	/**
	 * Show a list of all leaderboardinfos.
	 * GET leaderboardinfos
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const leaderboardinfo = await Leaderboardinfo.all();

		return view.render('Setup/leaderboard/index',{leaderboardinfo: leaderboardinfo.rows});
	}

	async all ({ request, response, view }){
		const topuppackages = await Leaderboardinfo.all();
		response.send(topuppackages);
		return
	}

	async create ({ request, response, view }) {
		return view.render('Setup.leaderboard.create');
	}

	async store ({ request, response }) {
		const fileName = await this._uploadLogo(request);
		const topuppackages = new Leaderboardinfo()
		topuppackages.content = request.input('content')
		topuppackages.banner = fileName
		await topuppackages.save()
		return response.redirect('/leaderboardinfo');
	}

	/**
	 * Display a single leaderboardinfo.
	 * GET leaderboardinfos/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show ({ params, request, response, view }) {
	}

	/**
	 * Render a form to update an existing leaderboardinfo.
	 * GET leaderboardinfos/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
		const topuppackages = await Leaderboardinfo.find(params.id);
		return view.render('Setup.leaderboard.edit',{topuppackages: topuppackages});
	}

	/**
	 * Update leaderboardinfo details.
	 * PUT or PATCH leaderboardinfos/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {

		const topuppackages = await Leaderboardinfo.find(params.id);
		if (!topuppackages){
				return "No Topuppackage for this id";
		}
		const fileName = await this._uploadLogo(request);
		topuppackages.content = request.input('content')
		topuppackages.banner = fileName
		await topuppackages.save();

		return response.redirect('/leaderboardinfo');
	}

	/**
	 * Delete a leaderboardinfo with id.
	 * DELETE leaderboardinfos/:id
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
		return response.redirect('/leaderboardinfo');
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
		await profilePic.move(Helpers.appRoot('public/uploads/leaderboard'), {
			name: fileName
		})
	
		if (!profilePic.moved()) {
			this.uploadError = profilePic.error();
			return false;
		}
		return fileName;
	}
}

module.exports = LeaderboardinfoController
