'use strict'

const Topuppackage = use('App/Models/Topuppackage')
const { validate } = use('Validator');
const Match = use('App/Models/Match')
const User = use('App/Models/User')
const Product = use('App/Models/Product')
const Maps = use('App/Models/Map')
const Prize = use('App/Models/Prize')
const Matchuser = use('App/Models/Matchuser')
class TopuppackageController {
	async index ({ request, response, view }) {
		const topuppackage = await Topuppackage.all();

		return view.render('Setup/Topuppackage/index',{topuppackages: topuppackage.rows});
	}

	async all ({ request, response, view }){
		const topuppackages = await Topuppackage.all();
		response.send(topuppackages);
		return
	}

	async create ({ request, response, view }) {
		const products = await Product
			.query()
			.where('isactivefortopup', '1')
			.fetch();
		return view.render('Setup.Topuppackage.create',{products: products.rows});
	}

	async store ({ request, response }) {
		const topuppackages = new Topuppackage()
		topuppackages.product_id = request.input('product_id')
		topuppackages.name = request.input('name')
		topuppackages.type = request.input('type')
		topuppackages.price = request.input('price')
		await topuppackages.save()
		return response.redirect('/topuppackage');
	}

	async show ({ params, request, response, view }) {
	}

	async edit ({ params, request, response, view }) {
		const topuppackages = await Topuppackage.find(params.id);
			const products = await Product
			.query()
			.where('isactivefortopup', '1')
			.fetch();
		return view.render('Setup.Topuppackage.edit',{topuppackages: topuppackages,products: products.rows});
	}

	async update ({ params, request, response }) {
		const topuppackages = await Topuppackage.find(params.id);
		if (!Topuppackage){
				return "No Topuppackage for this id";
		}
		topuppackages.product_id = request.input('product_id')
		topuppackages.name = request.input('name')
		topuppackages.price = request.input('price')
		await topuppackages.save();

		return response.redirect('/topuppackage');
	}

	async destroy ({ params, request, response }) {
		const topuppackages = await Topuppackage.find(params.id)
		if (!topuppackages) {
				return "No Topuppackage for this id";
		}
		await topuppackages.delete();
		return response.redirect('/topuppackage');
	}
}

module.exports = TopuppackageController
