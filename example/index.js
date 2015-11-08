var vraf = require('virtual-raf')
var h = require('virtual-dom/h')
var editor = require('data-editor')()
var grid = require('../index')()

var data = editor.init(require('./data.json'))

function render (state) {
  return grid.render(state.dataset)
}

var initialState = {
  dataset: data,
  activeRow: null
}

var tree = vraf(initialState, render, require('virtual-dom'))
document.getElementById('app').appendChild(tree())

render(initialState)
