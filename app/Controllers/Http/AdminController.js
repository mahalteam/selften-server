'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with admins
 */
const Appinfo = use('App/Models/Appinfo');
class AdminController {
	/**
	 * Show a list of all admins.
	 * GET admins
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async appinfo ({ request, response, view }) {
		const appinfo = await Appinfo.find(1);
		response.send(appinfo.version_code);
	}

	/**
	 * Render a form to be used for creating a new admin.
	 * GET admins/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async register ({ request, response, view }) {
	}

	/**
	 * Create/save a new admin.
	 * POST admins
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async loginview ({ request, response }) {
	}

	/**
	 * Display a single admin.
	 * GET admins/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async login ({ params, request, response, view }) {
	}

	/**
	 * Render a form to update an existing admin.
	 * GET admins/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
	}

	/**
	 * Update admin details.
	 * PUT or PATCH admins/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {
	}

	/**
	 * Delete a admin with id.
	 * DELETE admins/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, request, response }) {
	}
}

module.exports = AdminController
