'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with matches
 */
const { validate } = use('Validator');
const Match = use('App/Models/Match')
const User = use('App/Models/User')
const Product = use('App/Models/Product')
const Maps = use('App/Models/Map')
const Matchuser = use('App/Models/Matchuser')
class MatchController {
	/**
	 * Show a list of all matches.
	 * GET matches
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index ({ request, response, view }) {
		const match = await Match.all();
		const product = await Product.all();
		const maps = await Maps.all();
		return view.render('setup/match/index',
			{
			    maps: maps.rows,
			    products: product.rows,
			    match: match.rows
			}
		);
	}

	async matchbyid ({ params,request, response, view }) {
		const match = await Match.query().with('product').with('users').with('map').with('prizes').where('product_id',params.id).where('status', 'upcoming').orWhere('status', 'ongoing').fetch();
		response.json(match)
	}

	async singlematch ({ params,request, response, view }) {
		const match = await Match.query().with('product').with('users').with('map').with('prizes').where('id',params.id).where('status', 'upcoming').orWhere('status', 'ongoing').fetch();
		response.json(match)
	}

	async join ({ params,request, response, view }) {
		const matchuser = new Matchuser();
		var type = request.input('type');
		var totalfee = request.input('fee');
		var user_id=request.input('user_id');
		var match_id=request.input('match_id');

		const user = await User.find(user_id);
		user.wallet=user.wallet-totalfee
		user.save();
		
		if(type=='solo'){
			matchuser.user_id=user_id
			matchuser.match_id=match_id
			matchuser.gamename=request.input('player1')
			await matchuser.save()
		}else if(type=='duo'){
			matchuser.user_id=user_id
			matchuser.match_id=match_id
			matchuser.gamename=request.input('player1')
			await matchuser.save()

			matchuser.user_id=user_id
			matchuser.match_id=match_id
			matchuser.gamename=request.input('player2')
			await matchuser.save()
		}else{
			matchuser.user_id=user_id
			matchuser.match_id=match_id
			matchuser.gamename=request.input('player1')
			await matchuser.save()

			matchuser.user_id=user_id
			matchuser.match_id=match_id
			matchuser.gamename=request.input('player2')
			await matchuser.save()

			matchuser.user_id=user_id
			matchuser.match_id=match_id
			matchuser.gamename=request.input('player3')
			await matchuser.save()
		}
		response.json('success')
	}

	/**
	 * Render a form to be used for creating a new match.
	 * GET matches/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create ({ request, response, view }) {
		const products = await Product
			.query()
			.where('isactiveformatch', '1')
			.fetch();
		const maps =  await Maps.all();
		return view.render('Setup.match.create',{products: products.rows, maps: maps.rows});
	}

	/**
	 * Create/save a new match.
	 * POST matches
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store ({ request, response }) {
		const rules = {
			product_id: 'required',
			start_at: 'required',
			start_time: 'required',
			in_time: 'required',
			end_time: 'required',
			match_name: 'required',
			type: 'required',
			entry_fee: 'required',
			perkill: 'required',
			max_join: 'required',
			min_join: 'required',
			total_prize: 'required',

		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			return "Insert Form data error";
		}

		const match = new Match()

		match.product_id = request.input('product_id')
		match.map_id = request.input('map_id')
		match.start_at = request.input('start_at')
		match.start_time = request.input('start_time')
		match.in_time = request.input('in_time')
		match.end_time = request.input('end_time')
		match.match_name = request.input('match_name')
		match.perkill = request.input('perkill')
		match.entryfee = request.input('entry_fee')
		match.type = request.input('type')
		match.max_join = request.input('max_join')
		match.min_join = request.input('min_join')
		match.room_id = request.input('room_id')
		match.password = request.input('password')
		await match.save()
		return response.redirect('match');
	}

	/**
	 * Display a single match.
	 * GET matches/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show ({ params, request, response, view }) {
	}

	/**
	 * Render a form to update an existing match.
	 * GET matches/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit ({ params, request, response, view }) {
		const match = await Match.find(params.id)
		if (!match){
			return "No match for this id";
		}
		const products = await Product
			.query()
			.where('isactiveformatch', '1')
			.fetch();
		const maps =  await Maps.all();
		return view.render('Setup.match.edit',{match: match, products: products.rows, maps: maps.rows});
	}

	/**
	 * Update match details.
	 * PUT or PATCH matches/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update ({ params, request, response }) {
		const match = await Match.find(params.id)
		if (!match){
			return "No match for this id";
		}
		const rules = {
			product_id: 'required',
			start_at: 'required',
			start_time: 'required',
			in_time: 'required',
			end_time: 'required',
			match_name: 'required',
			type: 'required',
			entry_fee: 'required',
			perkill: 'required',
			max_join: 'required',
			min_join: 'required',
			room_id: 'required',
			password: 'required'

		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			console.log(validation.messages());
			return "Insert Form data error";
		}

		match.product_id = request.input('product_id')
		match.map_id = request.input('map_id')
		match.start_at = request.input('start_at')
		match.start_time = request.input('start_time')
		match.in_time = request.input('in_time')
		match.end_time = request.input('end_time')
		match.match_name = request.input('match_name')
		match.perkill = request.input('perkill')
		match.entryfee = request.input('entry_fee')
		match.type = request.input('type')
		match.max_join = request.input('max_join')
		match.min_join = request.input('min_join')
		match.room_id = request.input('room_id')
		match.password = request.input('password')

		await match.save()
		return response.redirect('match');
	}

	/**
	 * Delete a match with id.
	 * DELETE matches/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy ({ params, request, response }) {
		const match = await Match.find(params.id)
        if (!match) {
            return "No banner for this id";
        }
		await match.delete();
		return response.redirect('match');
	}
}

module.exports = MatchController
