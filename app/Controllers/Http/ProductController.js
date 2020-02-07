'use strict'
const Drive = use('Drive');
const { validate } = use('Validator');
const Product = use('App/Models/Product');
const Helpers = use('Helpers');

class ProductController {


	async index ({ request, response, view }) {
		const product = await Product.all();
		return view.render('Setup.Product/index',{products: product.rows});
	}

	async create ({ request, response, view }) {
		const product = await Product.all();
		return view.render('Setup.Product.create',{products: 'product'});
	}

	async store ({ request, response }) {
		const rules = {
			product_name: 'required',
		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			return "Insert Form data error";
		}

		const fileName = await this._uploadLogo(request);
		const product = new Product()

		product.name = request.input('product_name')
		product.rules = request.input('rules');
		product.logo = fileName
		product.isactiveforsale = request.input('for_sale', 0)
		product.isactiveformatch = request.input('for_match', 0)
		product.isactivefortopup = request.input('for_top_up', 0)

		await product.save()
		return response.redirect('product');
	}

	async show ({ params, request, response, view }) {
	}

	async matchproduct ({ params, request, response, view }) {
		const product = await Product.query().with('matches',(builder) => {
		    builder.where('status', 'upcoming').orWhere('status', 'ongoing')
		  }).where('isactiveformatch',1).fetch();
		return response.send(product);
	}

	// this is edit controller 

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
			product_name: 'required',
			rules: 'required'
		}
		const validation = await validate(request.all(), rules);
		if (validation.fails()) {
			return "Insert Form data error";
		}

		const fileName = await this._uploadLogo(request);
		product.name = request.input('product_name')
		product.rules = request.input('rules');
		product.isactiveforsale = request.input('for_sale', 0)
		product.isactiveformatch = request.input('for_match', 0)
		product.isactivefortopup = request.input('for_top_up', 0)
		if (fileName) {
			await Drive.delete(`${Helpers.appRoot()}/uploads/logo/${product.logo}`)
			product.logo = fileName;
		}

		await product.save();
		return response.redirect('/product');
	}

	async destroy ({ params, request, response }) {
		const product = await Product.find(params.id)
        if (!product) {
            return "No product for this id";
        }
        await Drive.delete(`${Helpers.appRoot()}/public/uploads/product/${product.product}`);
        await product.delete();
        return response.redirect('/product');
	}

	async _uploadLogo (request) { // this function is using for logo upload. This receive request as paramiter from request controller
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
		await profilePic.move(Helpers.appRoot('public/uploads/product'), {
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
