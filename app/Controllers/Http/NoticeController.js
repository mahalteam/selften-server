'use strict'
const Notice = use('App/Models/Notice')
class noticeController {
	async index ({ request, response, view }) {
        const notice = await Notice.all();
        return view.render('Setup/notice/index',{notices: notice.rows});
    }

    async all ({ request, response, view }){
        const notice = await Notice.all();
        response.send(notice);
        return
    }

    async create ({ request, response, view }) {
        const notice = await Notice.all();
        return view.render('Setup.notice.create',{notice: notice});
    }

    async store ({ request, response }) {
        const notice = new Notice()
       
        notice.notice = request.input('notice')
        await notice.save()
        return response.redirect('/notice');
    }

    async show ({ params, request, response, view }) {
    }

    async edit ({ params, request, response, view }) {
        const notice = await Notice.find(params.id);
        return view.render('Setup.notice.edit',{notice: notice});
    }

    async update ({ params, request, response }) {
        const notice = await Notice.find(params.id);
        if (!notice){
            return "No notice for this id";
        }
        notice.notice = request.input('notice')
        await notice.save();

        return response.redirect('/notice');
    }

    async destroy ({ params, request, response }) {
        const notice = await Notice.find(params.id)
        if (!notice) {
            return "No notice for this id";
        }
        await notice.delete();
        return response.redirect('/notice');
    }
}

module.exports = noticeController
