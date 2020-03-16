'use strict'

const Topuppackage = use('App/Models/Topuppackage')
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
		const topuppackages = await Topuppackage.all();
		return view.render('Setup.Topuppackage.create',{topuppackages: topuppackages});
	}

	async store ({ request, response }) {
		const topuppackages = new Topuppackage()
		topuppackages.product_id = request.input('product_id')
		topuppackages.name = request.input('name')
		topuppackages.price = request.input('price')
		await topuppackages.save()
		return response.redirect('/topuppackages');
	}

	async show ({ params, request, response, view }) {
	}

	async edit ({ params, request, response, view }) {
		const topuppackages = await Topuppackage.find(params.id);
		return view.render('Setup.Topuppackage.edit',{topuppackages: topuppackages});
	}

	async update ({ params, request, response }) {
		const topuppackages = await Topuppackage.find(params.id);
		if (!Topuppackage){
				return "No Topuppackage for this id";
		}
		topuppackages.product_id = request.input('product_id')
		topuppackages.name = request.input('name')
		topuppackages.price = request.input('price')
		await Topuppackage.save();

		return response.redirect('/Topuppackage');
	}

	async destroy ({ params, request, response }) {
		const topuppackages = await Topuppackage.find(params.id)
		if (!topuppackages) {
				return "No Topuppackage for this id";
		}
		await topuppackages.delete();
		return response.redirect('/Topuppackage');
	}
}

module.exports = TopuppackageController
