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
		const match = await Match.query().with('product').with('users').fetch();
		const product = await Product.all();
		const maps = await Maps.all();
		return view.render('Setup/match/index',
			{
			    maps: maps.rows,
			    products: product.rows,
			    match: match.toJSON()
			}
		);
	}

	async matchbyid ({ params,request, response, view }) {
		const match = await Match.query().with('product').with('users').with('map').with('prizes').where('product_id',params.id).where('status', 'upcoming').orWhere('status', 'ongoing').fetch();
		response.json(match)
	}

	async singlematch ({ params,request, response, view }) {
		const match = await Match.query().with('product').with('users').with('map').with('prizes').where('id',params.id).fetch();
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
	async store ({ request, session, response }) {
		const rules = {
			product_id: 'required',
			map_id: 'required',
			start_at: 'required',
			start_time: 'required',
			match_name: 'required',
			type: 'required',
			entry_fee: 'required',
			perkill: 'required',
			max_join: 'required',
			min_join: 'required',
			platform: 'required',
			total_prize: 'required',

		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			session
				.withErrors(validation.messages())
				.flashExcept()

				return response.redirect('back')
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
		match.total_prize = request.input('total_prize')
		match.platform = request.input('platform')
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
	async update ({ params, session, request, response }) {
		const match = await Match.find(params.id)
		if (!match){
			return "No match for this id";
		}
		const rules = {
			product_id: 'required',
			start_at: 'required',
			start_time: 'required',
			match_name: 'required',
			type: 'required',
			entry_fee: 'required',
			perkill: 'required',
			max_join: 'required',
			min_join: 'required',
			room_id: 'required',
			platform: 'required',
			password: 'required'

		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			session
			.withErrors(validation.messages())
				.flashExcept()

				return response.redirect('back')
		}

		match.product_id = request.input('product_id')
		match.map_id = request.input('map_id')
		match.start_at = request.input('start_at')
		match.start_time = request.input('start_time')
		match.match_name = request.input('match_name')
		match.perkill = request.input('perkill')
		match.entryfee = request.input('entry_fee')
		match.type = request.input('type')
		match.total_prize = request.input('total_prize')
		match.max_join = request.input('max_join')
		match.min_join = request.input('min_join')
		match.room_id = request.input('room_id')
		match.platform = request.input('platform')
		match.password = request.input('password')

		var abc = await match.save();
		return response.redirect('/match');
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
            return "No Match for this id";
        }
		await match.delete();
		return response.redirect('/match');
	}

	async totalplayer({ params, request, response,view }){
		const match = await Match.query().with('users').where('id',params.id).first();
		return view.render('Setup/match/totalplayer',
			{
			    match: match.toJSON()
			}
		);
	}


	async playerupdate ({ request, response, view, params }) {
		const id = params.id;
		const matchuser = await Matchuser.find(id);
		// console.log(user);
		return matchuser;
	}

	async playerUpdateStore ({ request, response}) {
		//collect update data
    const match_user_info = request.collect(['kill', 'id', 'previous_earn']);
	const id = match_user_info[0].id;
	const previous_earn = match_user_info[0].previous_earn;
    // find match user
	const collectmatchuser = await Matchuser.find(id);
	//belongsTo used to select metch data
	const user_match = await Matchuser.query().with('matches').fetch();
	const user_match_data = user_match.toJSON();
	const perkill = user_match_data[0].matches.perkill;
	const m_id = user_match_data[0].matches.id;
	//belongsTo used to select User data
	const match_player = await Matchuser.query().with('users').fetch();
	const match_player_data = match_player.toJSON();
	const tottal_earn_wallet = match_player_data[0].users.earn_wallet;
	const player_id =  match_player_data[0].users.id;
	// find match user
	const collectuser = await User.find(player_id);
	const new_earn_wallet = (tottal_earn_wallet - previous_earn) + match_user_info[0].kill * perkill;
	collectuser.earn_wallet = new_earn_wallet;
	// return match_player;
	// return perkill;
	collectmatchuser.total_kill = match_user_info[0].kill;
	collectmatchuser.total_earn = match_user_info[0].kill * perkill;
	// return collectmatchuser;
	//save match user data and user earn_wallet
	await collectmatchuser.save()
	await collectuser.save()
    response.redirect('/totalplayer/'+m_id)
  }



	async updatestatus({ params, request, response,view }){
		var match = Match.query().where('id', params.id).update({ status: request.input('status') });
		return match;
	}
}

module.exports = MatchController
