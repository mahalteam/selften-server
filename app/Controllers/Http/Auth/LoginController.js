'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class LoginController {
	showLoginForm ({ view }) {
		return view.render('auth.login')
	}

	async login ({ request, auth, session, response }) {
		// get form data
		const { email, password, remember } = request.all()

		// retrieve user base on the form data
		const user = await User.query()
			.where('email', email)
			.where('is_admin', 1)
			.first()

		if (user) {
			// verify password
			const passwordVerified = await Hash.verify(password, user.password)

			if (passwordVerified) {
				// login user
				await auth.authenticator('session').remember(!!remember).login(user)

				return response.route('/')
			}
		}

		// display error message
		session.flash({
			notification: {
				type: 'danger',
				message: `We couldn't verify your credentials. Make sure you've confirmed your email address.`
			}
		})

		return response.redirect('back')
	}

	async redirect ({ ally }) {
    	await ally.driver('facebook').redirect()
  	}

  	async callback ({ ally, auth }) {
	    try {
	      const fbUser = await ally.driver('facebook').getUser()

	      return fbUser;

	      // user details to be saved
	      const userDetails = {
	        email: fbUser.getEmail(),
	        token: fbUser.getAccessToken(),
	        login_source: 'facebook'
	      }

	      // search for existing user
	      const whereClause = {
	        email: fbUser.getEmail()
	      }

	      const user = await User.findOrCreate(whereClause, userDetails)
	      await auth.login(user)

	      return 'Logged in'
	    } catch (error) {
	      return 'Unable to authenticate. Try again later'
	    }
  	}

  	async redirectg ({ ally }) {
    	await ally.driver('google').redirect()
  	}

  	async callbackg ({ ally, auth }) {
	    try {
	      const fbUser = await ally.driver('google').getUser()
	      return fbUser;
	      // user details to be saved
	      const userDetails = {
	        email: fbUser.getEmail(),
	        token: fbUser.getAccessToken(),
	        login_source: 'google'
	      }

	      // search for existing user
	      const whereClause = {
	        email: fbUser.getEmail()
	      }

	      const user = await User.findOrCreate(whereClause, userDetails)
	      await auth.login(user)

	      return 'Logged in'
	    } catch (error) {
	      return 'Unable to authenticate. Try again later'
	    }
  	}
















  	async redirectToProvider ({ally, params}) {
	    await ally.driver(params.provider).redirect()
	}

	  async handleProviderCallback ({params, ally, auth, response}) {
	    const provider = params.provider

	        return provider

	    try {
	      const userData = await ally.driver(params.provider).getUser()

	      const authUser = await User.query().where({
	        'provider': provider,
	        'provider_id': userData.getId()
	      }).first()


	      if (!(authUser === null)) {
	        // let user = await auth.loginViaId(authUser.id)
	        let token = await auth.authenticator('jwt').generate(authUser)
			Object.assign(authUser, token)
	        return authUser
	      }

	      const user = new User()
	      // user.name = userData.getName()
	      user.username = userData.getNickname()
	      user.email = userData.getEmail()
	      user.provider_id = userData.getId()
	      user.avatar = userData.getAvatar()
	      user.provider = provider
	      await user.save()

	      let login = await auth.loginViaId(user.id)
	      return login
	    } catch (e) {
	      console.log(e)
	      response.redirect('/auth/' + provider)
	    }
	  }

}

module.exports = LoginController
