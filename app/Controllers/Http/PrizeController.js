'use strict'

const Match = use('App/Models/Match')
const Prize = use('App/Models/Prize')
const { validate } = use('Validator');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with prizes
 */
class PrizeController {
	/**
	 * Show a list of all prizes.
	 * GET prizes
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const prize = await Prize.query().with('match').fetch();
		return view.render('Setup.Prize.index',
			{
				prize: prize.toJSON()
			}
		);
	}

	/**
	 * Render a form to be used for creating a new prize.
	 * GET prizes/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create ({params, request, response, view }) {
		const matchs = await Match.find(params.id);
		return view.render('Setup.Prize.create',
			{
				match: matchs
			}
		);
	}

	/**
	 * Create/save a new prize.
	 * POST prizes
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store ({ request, response }) {
		const rules = {
			match_id: 'required',
			lavel: 'required',
			prize: 'required'
		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			return "Insert Form data error";
		}

		let match_id = request.input('match_id')

		const prize = new Prize()

		prize.match_id = match_id
		prize.prize = request.input('prize')
		prize.lavel = request.input('lavel')

		await prize.save()
		return response.redirect('/matchprize/'+match_id);
	}

	/**
	 * Display a single prize.
	 * GET prizes/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show ({ params, request, response, view }) {
	}

	/**
	 * Render a form to update an existing prize.
	 * GET prizes/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
		const prize = await Prize.find(params.id);
		const match = await Match.find(prize.match_id);
		return view.render('Setup.Prize.edit',
			{
				match,
				prize
			}
		);
	}

	/**
	 * Update prize details.
	 * PUT or PATCH prizes/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {
		const prize = await Prize.find(params.id);
		console.log('prize');
		const rules = {
			match_id: 'required',
			lavel: 'required',
			prize: 'required'

		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			return "Insert Form data error";
		}
		let match_id = request.input('match_id');
		prize.match_id = match_id
		prize.prize = request.input('prize')
		prize.lavel = request.input('lavel')

		await prize.save()
		return response.redirect('/matchprize/'+match_id);
	}

	/**
	 * Delete a prize with id.
	 * DELETE prizes/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, request, response }) {
		const prize =await Prize.find(params.id);
		let id = prize.match_id;
		if(!prize) {
			return "no prize for this id"
		}
		await prize.delete();
		return response.redirect('/matchprize/'+id);
	}
}

module.exports = PrizeController
