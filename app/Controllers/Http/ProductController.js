'use strict'
const  fs = require('fs')
const Drive = use('Drive');
const { validate } = use('Validator');
const Product = use('App/Models/Product')

class ProductController {

	uploadError;

	async index ({ request, response, view }) {
		const product = await Product.all();
		return view.render('setup/product/index',{products: product.rows});
	}

	async create ({ request, response, view }) {
		const product = await Product.all();
		return view.render('Setup.Product.create',{products: 'product'});
	}

	async store ({ request, response }) {
		const rules = {
			product_name: 'required'
		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			return "Insert Form data error";
		}

		const fileName = await this._uploadLogo(request);
		const product = new Product()

		product.name = request.input('product_name')
		product.logo = fileName
		product.isactiveforsale = request.input('for_sale', 0)
		product.isactiveformatch = request.input('for_match', 0)
		product.isactivefortopup = request.input('for_top_up', 0)

		await product.save()
		return  "True";
	}

	async show ({ params, request, response, view }) {
	}

	async edit ({ params, request, response, view }) {
		const product = await Product.find(params.id);
		return view.render('Setup.Product.edit',{product: product});
	}

	async update ({ params, request, response }) {
		const product = await Product.find(params.id);
		if (!product){
			return "No product for this id";
		}
		const rules = {
			product_name: 'required'
		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			return "Insert Form data error";
		}

		const fileName = await this._uploadLogo(request);
		product.name = request.input('product_name')
		product.isactiveforsale = request.input('for_sale', 0)
		product.isactiveformatch = request.input('for_match', 0)
		product.isactivefortopup = request.input('for_top_up', 0)
		if (fileName) {
			product.logo = fileName;
			await Drive.delete(`uploads/logo/${product.logo}`)
		}

		await product.save();
		return true;
	}

	async destroy ({ params, request, response }) {
	}

	async _uploadLogo (request) {
		const unixTime  = Date.now();
		const profilePic = request.file('logo_img', {
			types: ['image'],
			size: '1mb'
		})

		if (!profilePic) {
			this.uploadError = "No file";
			return false;
		}

		const fileName = `${unixTime}_logo.${profilePic.extname}`;
		await profilePic.move('uploads/logo', {
			name: fileName
		})
	
		if (!profilePic.moved()) {
			this.uploadError = profilePic.error();
			return false;
		}
		return fileName;
	}
}

module.exports = ProductController
