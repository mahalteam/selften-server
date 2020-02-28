'use strict'
const Drive = use('Drive');
const { validate } = use('Validator');
const Banner = use('App/Models/Banner')
const Helpers = use('Helpers')

class BannerController {

    async index ({ request, response, view }) {
        const banner = await Banner.all();
        return view.render('Setup/Banner/index',{banners: banner.rows});
    }

    async all ({ request, response, view }){
        const banner = await Banner.all();
        response.send(banner);
        return
    }

    async create ({ request, response, view }) {
        const banner = await Banner.all();
        return view.render('Setup.Banner.create',{banner: 'product'});
    }

    async store ({ request, response }) {
        const banner = new Banner()
        const fileName = await this._uploadBanner(request);

        if(!fileName){
            return "No Banner Uploaded"
        }

        banner.note = request.input('banner_note')
        banner.banner = fileName
        banner.isactive = request.input('is_active', 0)

        await banner.save()
        return response.redirect('/banner');
    }

    async show ({ params, request, response, view }) {
    }

    async edit ({ params, request, response, view }) {
        const banner = await Banner.find(params.id);
        return view.render('Setup.Banner.edit',{banner: banner});
    }

    async update ({ params, request, response }) {
        const banner = await Banner.find(params.id);
        if (!banner){
            return "No product for this id";
        }

        const fileName = await this._uploadBanner(request);
        if (fileName) {
            let  deleted =  await Drive.delete(`${Helpers.appRoot()}/uploads/banner/${banner.banner}`);
            banner.banner = fileName;
        }

        banner.note = request.input('banner_note')
        banner.isactive = request.input('is_active')
        await banner.save();

        return true;
    }

    async destroy ({ params, request, response }) {
        const banner = await Banner.find(params.id)
        if (!banner) {
            return "No banner for this id";
        }
        await Drive.delete(`${Helpers.appRoot()}/public/uploads/banner/${banner.banner}`);
        await banner.delete();
        return response.redirect('/banner');
    }

    async _uploadBanner (request) { // this function is using for logo upload. This receive request as paramiter from request controller
        const unixTime  = Date.now();
        const profilePic = request.file('banner_img', {
            types: ['image'],
            size: '1mb'
        })

        if (!profilePic) {
            this.uploadError = "No file";
            return false;
        }

        const fileName = `${unixTime}_banner.${profilePic.extname}`;
        await profilePic.move(Helpers.appRoot('public/uploads/banner'), {
            name: fileName
        })

        if (!profilePic.moved()) {
            this.uploadError = profilePic.error();
            return false;
        }
        return fileName;
    }
}

module.exports = BannerController
