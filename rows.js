var ViewList = require('view-list')
var dataset = require('data-set')
var extend = require('extend')

module.exports = function rowsView (opts) {
  var rowHeight = opts.rowHeight || 30
  var height = window.innerHeight - rowHeight
  var options = extend({
    className: 'data-grid-rows',
    rowHeight: rowHeight,
    eachrow: rows,
    readonly: true,
    properties: {},
    height: height
  }, opts)

  var list = ViewList(options)

  function rows (row) {
    if (row.id && !row.key) row.key = row.id
    if (!row.value) row.value = row.properties
    var properties = Object.keys(row.value)
    var elements = properties.map(element)

    function element (key) {
      function onfocus (e) {
        list.send('focus', e, row, key, row.value[key])
      }

      function onblur (e) {
        list.send('blur', e, row, key, row.value[key])
      }

      function onclick (e) {
        console.log('click is happening')
        list.send('click', e, row, key, row.value[key])
      }

      function oninput (e) {
        row.value[key] = e.target.value
        list.send('input', e, row, key, row.value[key])
      }

      var value
      if (typeof row.value[key] === 'object') value = null
      else if (typeof row.value[key] === 'number') value = '' + row.value[key]
      else if (typeof row.value[key] === 'boolean') value = row.value[key].toString()
      else value = row.value[key]

      var propertyOptions = {
        value: value,
        id: 'cell-' + row.key + '-' + key,
        attributes: {
          'data-type': 'string', // todo: use property type from options.properties
          'data-key': key,
          rows: 1
        },
        onfocus: onfocus,
        onblur: onblur,
        onclick: onclick,
        oninput: oninput
      }

      if (list.readonly) {
        propertyOptions.attributes.readonly = true
      }

      var classList = '.data-grid-value' + (list.readonly ? '.readonly' : '')
      return list.html('li.data-grid-value-wrapper', [
        list.html('textarea' + classList, propertyOptions)
      ])
    }

    var rowOptions = { attributes: { 'data-key': row.key } }

    if (row.active) {
      rowOptions.className = 'active'
      rowOptions.attributes['data-active'] = 'true'
    }

    return list.html('li.data-grid-row', rowOptions, [
      list.html('ul.data-grid-row-items', elements)
    ])
  }

  return list
}
