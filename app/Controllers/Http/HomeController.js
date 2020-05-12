'use strict'
const Hash = use('Hash')
const User = use('App/Models/User');
const Database = use('Database')
class HomeController {
    async index ({ view }) {
        let wallet = await Database.from('users').sum('wallet as wallet').sum('earn_wallet as earn_wallet').count('id as totaluser');
        return view.render("index",{data:wallet[0]});
    }
    table ({view}) {
        return view.render("table");
    }

    async hastext({ params, view }){
    	let savepass = await Hash.make('123456')

    	const isSame = await Hash.verify('123456', savepass)
    	return isSame;
    }

    async countsection({ response }){
        const total = await User.query().getCount();
        const todaynew = await User.query().whereBetween("created_at", [new Date(new Date(Date.now()-10000000).toDateString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' '), new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' ')]).getCount();
        // return response.send(new Date(new Date(Date.now()-10000000).toDateString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' '));
        return response.send({total:total,todaynew:todaynew});
    }
}

module.exports = HomeController
