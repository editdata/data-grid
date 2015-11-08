var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = PropertiesView
inherits(PropertiesView, BaseElement)

function PropertiesView (options) {
  if (!(this instanceof PropertiesView)) return new PropertiesView(options)
  BaseElement.call(this, options.el)
}

PropertiesView.prototype.render = function (state) {
  var properties = state.properties
  var self = this
  var items = []

  Object.keys(properties).forEach(function (key) {
    var property = properties[key]
    items.push(self.html('li#' + property.key + '.data-grid-property', [
      self.html('span.data-grid-property-name', property.name),
      self.html('button.data-grid-property-configure.small', {
        onclick: function (e) {
          self.send('property:configure')
        }
      }, self.html('i.fa.fa-gear', ''))
    ]))
  })

  var vtree = this.html('ul.data-grid-properties', this, items)
  return this.afterRender(vtree)
}
