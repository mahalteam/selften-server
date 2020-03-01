'use strict'
const Hash = use('Hash')
class HomeController {
    index ({ view }) {
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
