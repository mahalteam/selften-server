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
}

module.exports = LoginController
