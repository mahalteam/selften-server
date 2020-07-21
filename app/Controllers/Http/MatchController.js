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
const Prize = use('App/Models/Prize')
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
		const page = request.get().page || 1
		const match = await Match.query().with('product').with('users').orderBy('id', 'desc').paginate(page,10);
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


	async matchdata({params ,request, response}){

		const match = await Match.find(params.matchid);

		const user = await User.find(params.userid);

		let canjoin=false;
		let isjoin=false;

		const matchuser = await Matchuser.query().where('match_id',params.matchid).where('user_id',params.userid).getCount();


		if(matchuser>0){
			isjoin=true;
		}

		if(user.wallet+user.earn_wallet>=match.entryfee){
			canjoin=true;
		}

		response.json({result:{isjoin:isjoin,canjoin:canjoin,match:match,user:user}})
	}

	async percipient({params ,request, response}){
		const matchuser = await Matchuser.query().with('users').where('match_id',params.matchid).fetch();
		response.json({result:matchuser})
	}

	async prize({params ,request, response}){
		const matchuser = await Prize.query().where('match_id',params.matchid).fetch();
		response.json({result:matchuser})
	}

	async rulse({params ,request, response}){
		const product = await Product.query().where('id',params.productid).fetch();
		response.json({result:product})
	}


	async matchprize ({ params ,request, response, view }){
		const prize = await Prize.query().with('match').where('match_id',params.id).fetch();
		return view.render('Setup.Prize.index',
			{
				prize: prize.toJSON(),
				match_id:params.id
			}
		);
	}

	async matchbyid ({ params,request, response, view }) {
		const match = await Match.query().with('product').with('users').with('map').with('prizes').where('status', 'upcoming').orWhere('status', 'ongoing').orWhere('status', 'result').orderBy('id', 'desc').limit(15).fetch();
		response.json(match)
	}

	async matchbystatus ({ params,request, response, view }){
		// let match=[];
		// if(params.status=='result'){
			let match = await Match.query().with('product').with('users').with('map').with('prizes').where('product_id',params.id1).where('status',params.status).orderBy('id', 'desc').limit(5).fetch();
		// }else{
		// 	let match = await Match.query().with('product').with('users').with('map').with('prizes').where('status',params.status).limit(35).fetch();
		// }
		response.json(match)
	}

	async matchbystatusapp ({ params,request, response, view }){
		// let match=[];
		// if(params.status=='result'){
			let match = await Match.query().with('product').with('users').with('map').with('prizes').where('product_id',params.id1).where('status',params.status).orderBy('id', 'desc').limit(5).fetch();
		// }else{
		// 	let match = await Match.query().with('product').with('users').with('map').with('prizes').where('status',params.status).limit(35).fetch();
		// }
		response.json({result:match})
	}

	async singlematch ({ params,auth,request, response, view }) {
		const match = await Match.query().with('product').with('users').with('map').with('prizes').where('id',params.id).fetch();
		response.json(match)
	}

	async join ({ params,request, auth,response, view }) {
		
		var type = request.input('type');
		var totalfee = request.input('fee');
		// var user_id=request.input('user_id');
		var user_id= await auth.current.user.id
		var match_id=request.input('match_id');

		let matchuser= await Matchuser.query().where('match_id',match_id).getCount();

		let match = await Match.query().where('id',match_id).first();

		if(type=='solo'){
			matchuser=matchuser
		}else if(type=='duo'){
			matchuser=matchuser+1
		}
		else{
			matchuser=matchuser+3
		}

		if(match.max_join>matchuser){
			let user = await User.find(user_id);
			let wallet = user.wallet;
			if((wallet+user.earn_wallet)>=totalfee){

				if(wallet-totalfee>=0){
					user.wallet=user.wallet-totalfee
					user.matchesplayed=user.matchesplayed+1
					await user.save();
				}else{
					user.wallet=0;
					let current = totalfee-wallet;
					user.matchesplayed=user.matchesplayed+1
					user.earn_wallet=user.earn_wallet-current;
					await user.save();
				}
			
				if(type=='solo'){
					const matchuser = new Matchuser();
					matchuser.user_id=user_id
					matchuser.match_id=match_id
					matchuser.gamename=request.input('player1')
					await matchuser.save()
					let user1 = await User.find(user_id);
					user1.leaderboard=user1.leaderboard+15;
					await user1.save()
				}else if(type=='duo'){
					
					const matchuser = new Matchuser();
					matchuser.user_id=user_id
					matchuser.match_id=match_id
					matchuser.gamename=request.input('player1')
					await matchuser.save()

					const matchuser1 = new Matchuser();
					matchuser1.user_id=user_id
					matchuser1.match_id=match_id
					matchuser1.gamename=request.input('player2')
					await matchuser1.save()
					let user1 = await User.find(user_id);
					user1.leaderboard=user1.leaderboard+30;
					await user1.save()

				}else{
					const matchuser = new Matchuser();
					matchuser.user_id=user_id
					matchuser.match_id=match_id
					matchuser.gamename=request.input('player1')
					await matchuser.save()

					const matchuser1 = new Matchuser();
					matchuser1.user_id=user_id
					matchuser1.match_id=match_id
					matchuser1.gamename=request.input('player2')
					await matchuser1.save()

					const matchuser2 = new Matchuser();
					matchuser2.user_id=user_id
					matchuser2.match_id=match_id
					matchuser2.gamename=request.input('player3')
					await matchuser2.save()

					const matchuser3 = new Matchuser();
					matchuser3.user_id=user_id
					matchuser3.match_id=match_id
					matchuser3.gamename=request.input('player4')
					await matchuser3.save()
					let user1 = await User.find(user_id);
					user1.leaderboard=user1.leaderboard+45;
					await user1.save()
				}
				response.json('success')
			}
			else{
				response.json('faliled')
			}
		}else{
			response.json('faliled')
		}
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
		// match.in_time = request.input('in_time')
		// match.end_time = request.input('end_time')
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
		const id = params.id;
		const match = await Match.query().with('users').with('prizes').where('id',id).first();
		let sum = await Matchuser.query().where('match_id',id).sum('total_earn as sum');
		return view.render('Setup/match/totalplayer',
			{
				match: match.toJSON(),
				sum:sum[0]
			}
		);
	}


	async playerupdate ({ request, response, view, params }) {
		const matchuser = await Matchuser.query().with('matches').where('id',params.id).first();
		return response.send(matchuser);
	}

	async playerUpdateStore ({ request, response}) {
		//collect update data
		const id = request.input('id');
		const previous_earn = request.input('previous_earn');
		const kill = request.input('kill');
		const oldkill = request.input('oldkill');
		const oldprize = request.input('oldprize');

		const matchuser = await Matchuser.find(id);
		const match = await Match.find(matchuser.match_id);

		const perkill =match.perkill;
		const m_id = match.id;

		// if get first prize leader board will update
		// console.log(m_id)
		// console.log(previous_earn)
		// let prize = await Prize.query().where('match_id',m_id).where('prize',previous_earn).first();
		// console.log(prize)


		// find match user
		const user = await User.find(matchuser.user_id);

		if(oldkill>0){
			let wallet = (oldkill * perkill);
			user.earn_wallet = user.earn_wallet-wallet;
			user.leaderboard = user.leaderboard-(oldkill*5);
			user.totalkills  = user.totalkills-oldkill;
			await user.save()
		}

		if(oldprize>0){
			user.earn_wallet = user.earn_wallet-oldprize;
			await user.save()
		}

		const new_earn_wallet = (parseInt(kill * perkill))+parseInt(previous_earn);

		user.earn_wallet = parseInt(user.earn_wallet)+parseInt(new_earn_wallet);

		// user.earn_wallet

		user.totalkills  = parseInt(user.totalkills)+parseInt(kill);
		user.leaderboard = user.leaderboard+kill*5;
		// return match_player;
		// return perkill;
		matchuser.prize = previous_earn;
		matchuser.total_kill = kill;
		matchuser.total_earn = (parseInt(kill * perkill))+parseInt(previous_earn);
		// return collectmatchuser;
		//save match user data and user earn_wallet
		await matchuser.save()
		await user.save()
	    response.redirect('/totalplayer/'+m_id)
  	}

	async updatestatus({ params, request, response,view }){
		const cheak_status = request.input('status');
		var match = Match.query().where('id', params.id).update({ status: request.input('status') });

		if( cheak_status=='cancel')
		{
			const match1 = await Match.find(params.id);
			const match1_user = await match1.users().fetch()
			const match1_users = match1_user.rows;
			const entry_fee = match1.entryfee;
			
			for(var i=0; i<match1_users.length; i++)
			{
				console.log(match1_users[i])
				let users = await User.find(match1_users[i].id);
				console.log(match1_users[i])
				const update_earn_wallet = users.earn_wallet + entry_fee;
				await User.query().where('id', match1_users[i].id).update({ earn_wallet: update_earn_wallet });
			}
		}
		return match;
	}
}

module.exports = MatchController
