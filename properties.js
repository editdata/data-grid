var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = TableProperties
inherits(TableProperties, BaseElement)

function TableProperties (options) {
  if (!(this instanceof TableProperties)) return new TableProperties(options)
  BaseElement.call(this, options.el)
}

TableProperties.prototype.render = function (properties) {
  var self = this
  var items = []

  Object.keys(properties).forEach(function (key) {
    var property = properties[key]
    items.push(self.html('li#' + property.key + '.data-table-property', [
      self.html('span.data-table-property-name', property.name),
      self.html('button.data-table-property-configure.small', {
        onclick: function (e) {
          self.send('property:configure')
        }
      }, self.html('i.fa.fa-gear', ''))
    ]))
  })

  var vtree = this.html('ul.data-table-properties', this, items)
  return this.afterRender(vtree)
}
