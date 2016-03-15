var formatter = require('data-format')()
var xtend = require('xtend')
var vdom = require('virtual-dom')
var createApp = require('virtual-app')
var form = require('data-form')
var grid = require('../index')
var h = vdom.h

var data = require('./data.json')
var formatted = formatter.format(data)
var app = createApp(vdom)

var initialState = {
  properties: formatted.properties,
  data: formatted.data,
  activeRow: null,
  activeProperty: null
}
function modifier (action, state) {
  var data
  if (action.type === 'setActive') {
    return xtend(state, {
      activeRowKey: action.activeRowKey,
      activePropertyKey: action.activePropertyKey
    })
  }
  if (action.type === 'destroyActiveRow') {
    data = state.data.slice()
    data = data.filter(function (row) {
      return row.key !== state.activeRowKey
    })
    return xtend(state, {
      data: data
    })
  }
  if (action.type === 'updateCellContent') {
    data = state.data.slice()
    data.some(function (row) {
      if (row.key === action.rowKey) {
        row.value[action.propertyKey] = action.value
        return true
      }
    })
    return xtend(state, {
      data: data
    })
  }
}

var render = app.start(modifier, initialState)

var domTree = render(function (state) {
  var GridComponent
  var FormComponent

  var gridState = {
    properties: state.properties,
    data: state.data,
    onclick: onGridClick
  }

  GridComponent = grid(h, gridState)

  if (state.activeRowKey) {
    var activeRow
    state.data.some(function (row) {
      if (row.key !== state.activeRowKey) return false
      activeRow = row
      return true
    })
    var formState = {
      row: activeRow,
      properties: state.properties,
      activeColumnKey: state.activePropertyKey,
      onclose: onFormClose,
      ondestroy: onFormDestroyRow,
      oninput: onFormInput
    }
    FormComponent = form(h, formState)
  }

  return h('div#app', [
    GridComponent,
    FormComponent
  ])
})

function onGridClick (event, rowKey, propertyKey) {
  app.store({
    type: 'setActive',
    activeRowKey: rowKey,
    activePropertyKey: propertyKey
  })
}

function onFormClose (event) {
  app.store({
    type: 'setActive',
    activeRowKey: null,
    activePropertyKey: null
  })
}

function onFormDestroyRow (event) {
  app.store({ type: 'destroyActiveRow' })
  app.store({
    type: 'setActive',
    activeRowKey: null,
    activePropertyKey: null
  })
}

function onFormInput (event, rowKey, propertyKey, value) {
  app.store({
    type: 'updateCellContent',
    rowKey: rowKey,
    propertyKey: propertyKey,
    value: value
  })
}

document.body.appendChild(domTree)
