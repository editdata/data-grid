var Thunk = require('vdom-thunk')
var RowsComponent = require('./rows')
var PropertiesComponent = require('./properties')

module.exports = DataGrid

function DataGrid (h, options) {
  var propertiesOptions = {
    properties: options.properties,
    onmouseover: options.onmouseover,
    onmouseout: options.onmouseout,
    onconfigure: options.onconfigure,
    h: h
  }

  var rowsOptions = {
    readonly: options.readonly,
    data: options.data,
    rowHeight: options.rowHeight,
    onfocus: options.onfocus,
    onblur: options.onblur,
    onclick: options.onclick,
    oninput: options.oninput,
    properties: options.properties,
    activeRowKey: options.activeRowKey,
    activePropertyKey: options.activePropertyKey,
    h: h
  }

  return h('div#data-grid', [
    Thunk(PropertiesComponent, propertiesOptions),
    Thunk(RowsComponent, rowsOptions)
  ])
}
