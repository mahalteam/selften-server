'use strict'
const Hash = use('Hash')
const User = use('App/Models/User');
const Database = use('Database')
class HomeController {
    index ({ view }) {
        let wallet = Database.from('users').sum('wallet as wallet').sum('earn_wallet as earn_wallet').count('id as totaluser');
        // return wallet;
        return view.render("index");
    }
    table ({view}) {
        return view.render("table");
    }

    async hastext({ params, view }){
    	let savepass = await Hash.make('123456')

    	const isSame = await Hash.verify('123456', savepass)
    	return isSame;
    }
}

module.exports = HomeController
