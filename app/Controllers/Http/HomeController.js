'use strict'

class HomeController {
    index ({ view }) {
        return view.render("index");
    }
}

module.exports = HomeController
