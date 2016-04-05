var fields = require('data-fields')
var formatter = require('data-format')()

/**
 * Apply this function to each row
 * @param  {Object} options
 * @return {Function}
 */
module.exports = function Row (options) {
  var h = options.h
  var onfocus = options.onfocus
  var onblur = options.onblur
  var onclick = options.onclick
  var oninput = options.oninput
  var properties = options.properties
  var activeRowKey = options.activeRowKey
  var activePropertyKey = options.activePropertyKey
  var editable = options.editable || false

  function onFocus (rowKey, propertyKey) {
    return function (event) {
      if (onfocus) return onfocus(event, rowKey, propertyKey)
    }
  }

  function onBlur (rowKey, propertyKey) {
    return function (event) {
      if (onblur) return onblur(event, rowKey, propertyKey)
    }
  }

  function onClick (rowKey, propertyKey) {
    return function (event) {
      if (onclick) return onclick(event, rowKey, propertyKey)
    }
  }

  function onInput (rowKey, propertyKey) {
    return function (event) {
      if (oninput) return oninput(event, rowKey, propertyKey)
    }
  }

  return function eachRow (row) {
    if (!row) return
    if (!row.key) row.key = row.id
    if (!row.value) row.value = row.properties || {}
    var active = activeRowKey === row.key
    var propertyKeys = Object.keys(row.value)
    var elements = propertyKeys.map(element)

    function element (key) {
      var prop = formatter.findProperty(properties, key)
      var type = prop.type[0]
      if (type === 'undefined') type = 'string'
      var value = row.value[key]

      // avoid rendering `null` when field is not editable
      value = (!value && !editable) ? '' : value

      var propertyOptions = {
        h: h,
        value: value,
        id: 'cell-' + row.key + '-' + key,
        attributes: {
          'data-type': type, // todo: use property type from options.properties
          'data-key': key,
          rows: 1
        },
        editable: editable,
        onfocus: onFocus(row.key, key),
        onblur: onBlur(row.key, key),
        onclick: onClick(row.key, key),
        oninput: onInput(row.key, key)
      }

      if (active && key === activePropertyKey) {
        propertyOptions.className = 'active'
      }

      if (!options.editable) {
        propertyOptions.attributes.readonly = true
      }

      var field = fields[type]
      return field(h, propertyOptions)
    }

    var rowOptions = {
      className: 'data-grid-row',
      attributes: { 'data-key': row.key }
    }

    if (active) {
      rowOptions.className = 'data-grid-row active'
      rowOptions.attributes['data-active'] = 'true'
    }

    return h('li', rowOptions, [
      h('.data-grid-row-items', elements)
    ])
  }
}
