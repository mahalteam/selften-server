'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with maps
 */
const { validate } = use('Validator');
const Maps = use('App/Models/Map')
class MapController {
	/**
	 * Show a list of all maps.
	 * GET maps
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const maps = await Maps.all();
		return view.render('setup/map/index',{maps: maps.rows});
	}

	/**
	 * Render a form to be used for creating a new map.
	 * GET maps/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create ({ request, response, view }) {
		
	}

	/**
	 * Create/save a new map.
	 * POST maps
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store ({ request, response }) {
		let maps = new Maps();
		maps.name=request.input('name');
		await maps.save();
		response.redirect('/map')
	}

	/**
	 * Display a single map.
	 * GET maps/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show ({ params, request, response, view }) {
		const id = params.id;
		console.log(params);
	}

	/**
	 * Render a form to update an existing map.
	 * GET maps/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
		const id = params.id;
		// Console.log(id);
		const map = await Maps.find(id);
		return map;
	}

	/**
	 * Update map details.
	 * PUT or PATCH maps/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {
		const map = request.collect(['name']);
		const id = params.id;
		const d_map = await Maps.find(id);
			d_map.name = map[0].name;
		await d_map.save();
		response.redirect('/map')
	}

	/**
	 * Delete a map with id.
	 * DELETE maps/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, request, response }) {
		const id = params.id;
		console.log(params);
		const map = await Maps.find(id);
		await map.delete();
		response.redirect('/map');
	}
}

module.exports = MapController
