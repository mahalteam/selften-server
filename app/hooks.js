'use strict'

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('Adonis/Src/View')

  View.global('range', (start, size) => {
    return [...Array(size).keys()].map(i => i + start)
  })
})