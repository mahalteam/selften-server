'use strict'

class AuthenticatedController {
  async logout ({ auth, response }) {
    await auth.authenticator('session').logout()

    return response.redirect('/login')
  }
}

module.exports = AuthenticatedController
