'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
 const User = use('App/Models/User')
class UserController {
	/**
	 * Show a list of all users.
	 * GET users
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const page = request.get().page || 1
		const email = request.get().email;
		const user_id = request.get().user_id;
		let user=[];
		if(email){
			user = await User.query().where('email',email).fetch();
		}else if(user_id){
			user = await User.query().where('id',user_id).fetch();
		}
		else{
			user = await User.query().paginate(page,10);
		}
		return view.render('Setup/users/index',{users: user.toJSON()});
	}

	async resetleaderboard ({request, response, view}){
		await User.query().update({ leaderboard: 0 });
		response.redirect('/users');
	}

	async leaderboard ({request, response, view}){
		let users = await User.query().orderBy('leaderboard','desc').limit(100).fetch();
		response.send(users);
	}

	async banned({ request, response, view,params }){
		await User.query().where('id',params.id).update({ is_banned: 1 });
		response.redirect('/users');
	}

	async unbanned({ request, response, view,params }){
		await User.query().where('id',params.id).update({ is_banned: 0 });
		response.redirect('/users');
	}

	/**
	 * Render a form to be used for creating a new user.
	 * GET users/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create ({ request, response, view }) {
	}

	/**
	 * Create/save a new user.
	 * POST users
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store ({ request, response }) {
	}

	/**
	 * Display a single user.
	 * GET users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show ({ params, request, response, view }) {

 		let user = User.find(params)

 		return user;
		return view.render('Setup/users/singleuser',{user: user.rows});

	}

	/**
	 * Render a form to update an existing user.
	 * GET users/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
	}

	/**
	 * Update user details.
	 * PUT or PATCH users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {
	}

	/**
	 * Delete a user with id.
	 * DELETE users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, request, response }) {
	}
}

module.exports = UserController
