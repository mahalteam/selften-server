 //../app/Controllers/Http/AuthController.js
'use strict'
const User = use('App/Models/User');
const { validate } = use('Validator');
const Persona = use('Persona')
const Hash = use('Hash')
class AuthController {

	async register({request, auth, response}) {

		const rules = {
	      email: 'required|email|unique:users,email',
	      password: 'required',
	      phone: 'required',
	      password: 'required',
	    }

	    const validation = await validate(request.all(), rules)

	    if (validation.fails()) {
	      return response.json(validation.messages())
	    }

		let user = await User.create(request.all())

		//generate token for user;
		let token = await auth.generate(user)
		user = await User.findBy('id', user.id)
		Object.assign(user, token)

		return response.json(user)
	}

	async register1 ({ request, auth, response }) {

		const rules = {
	      email: 'required|email|unique:users,email',
	      password: 'required!confirmed',
	      phone: 'required',
	      password: 'required',
	    }

	    const validation = await validate(request.all(), rules)

	    if (validation.fails()) {
	      return response.json(validation.messages())
	    }

		const payload = request.only(['username','phone','email', 'password', 'password_confirmation'])

		let user = await Persona.register(payload)

	  	// optional
	  	let token= await auth.authenticator('jwt').generate(user);
	  	user = await User.findBy('id', user.id)
		Object.assign(user, token)
		return response.json(user)
	}

	async login({request, auth, response}) {

		let {email, password} = request.all();

		try {
			// if (await auth.authenticator('jwt').attempt(email, password)) {
			// 	let user = await User.findBy('email', email)
			// 	let token = await auth.authenticator('jwt').generate(user)

			// 	Object.assign(user, token)
			// 	return response.json(user)
			// }

			// retrieve user base on the form data
			const user = await User.query()
				.where('email', email)
				.first()

			if (user) {
				// verify password
				const passwordVerified = await Hash.verify(password, user.password)

				if (passwordVerified) {
					let token = await auth.authenticator('jwt').generate(user)

					Object.assign(user, token)
					return response.json(user)
				}else{
					return response.json({message: 'These credentials do not match our records..'})
				}
			}
			else{
				return response.json({message: 'These credentials do not match our records.'})
			}

		}
		catch (e) {
			console.log(e)
			return response.json({message: 'These credentials do not match our records.'})
		}
	}

	async login1 ({ request, auth, response }) {
	  const payload = request.only(['uid', 'password'])
	  const user = await Persona.verify(payload)

	  await auth.authenticator('jwt').login(user)
	  response.redirect('/dashboard')
	}

	async updateuser({request, response,params}){
		let user = await User.findBy('id', params.id)
		return response.json(user)
	}

	async verifyEmail ({ params, session, response }) {
	  	const user = await Persona.verifyEmail(params.token)

	  	session.flash({ message: 'Email verified' })
	  	response.redirect('back')
	}

	async updatePassword ({ request, auth }) {
	  	const payload = request.only(['old_password', 'password', 'password_confirmation'])
	  	const user = auth.user
	  	await Persona.updatePassword(user, payload)
	}

	async forgotPassword ({ request }) {
	  	let data = await Persona.forgotasas('asas')
	  	return Persona;
	}

	async getPosts({request, response}) {
		let posts = await Post.query().with('user').fetch()

		return response.json(posts)
	}

}
module.exports = AuthController