'use strict'

class HomeController {
    index ({ view }) {
        return view.render("index");
    }
    table ({view}) {
        return view.render("table");
    }
}

module.exports = HomeController
