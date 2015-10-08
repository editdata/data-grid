var BaseElement = require('base-element')
var inherits = require('inherits')
var rowsView = require('./rows')
var propertiesView = require('./properties')

module.exports = DataGrid
inherits(DataGrid, BaseElement)

function DataGrid (options) {
  if (!(this instanceof DataGrid)) return new DataGrid(options)
  options = options || {}
  BaseElement.call(this, options.el)
  var self = this

  this.rows = rowsView(options)
  this.properties = propertiesView(options)
  this.rows.addEventListener('load', function (el) {
    el.style.height = (window.innerHeight - (options.offsetX || 35)) + 'px'
  })
  
  this.rows.addEventListener('click', function (e, row, key, value) {
    self.send('click', e, row, key, value)
  })

  this.rows.addEventListener('focus', function (e, row, key, value) {
    self.send('focus', e, row, key, value)
  })

  this.rows.addEventListener('blur', function (e, row, key, value) {
    self.send('blur', e, row, key, value)
  })

  this.rows.addEventListener('input', function (e, row, key, value) {
    self.send('input', e, row, key, value)
  })
}

DataGrid.prototype.render = function (state) {
  var vtree = this.html('div#data-grid', [
    this.properties.render(state.properties),
    this.rows.render(state.data)
  ])
  return this.afterRender(vtree)
}
