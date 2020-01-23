 //../app/Controllers/Http/AuthController.js
'use strict'
const User = use('App/Models/User');

class AuthController {

	async register({request, auth, response}) {

		let user = await User.create(request.all())

		//generate token for user;
		let token = await auth.generate(user)

		Object.assign(user, token)

		return response.json(user)
	}

	async login({request, auth, response}) {

		let {email, password} = request.all();

		try {
			if (await auth.attempt(email, password)) {
				let user = await User.findBy('email', email)
				let token = await auth.generate(user)

				Object.assign(user, token)
				return response.json(user)
			}


		}
		catch (e) {
			console.log(e)
			return response.json({message: 'You are not registered!'})
		}
	}
	async getPosts({request, response}) {
		let posts = await Post.query().with('user').fetch()

		return response.json(posts)
	}

}
module.exports = AuthController