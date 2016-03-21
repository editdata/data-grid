var formatter = require('data-format')()
var xtend = require('xtend')
var vdom = require('virtual-dom')
var createApp = require('virtual-app')
var form = require('data-form')
var grid = require('../index')
var data = require('./data.json')
var h = vdom.h

var formatted = formatter.format(data)
var app = createApp(vdom)

// Grid initial state
var initialState = {
  properties: formatted.properties,
  data: formatted.data,
  activeRow: null,
  activeProperty: null
}

/**
 * `virtual-app` modifier function
 * @param  {Object} action Action object
 * @param  {Object} state  Current app state
 * @return {Object}        Returns new state object
 */
function modifier (action, state) {
  var data

  // Set the currently active Row key and Property/Column key.
  // Allows us to focus the correct field on the `data-form`.
  if (action.type === 'setActive') {
    return xtend(state, {
      activeRowKey: action.activeRowKey,
      activePropertyKey: action.activePropertyKey
    })
  }

  // Delete the currently active row
  if (action.type === 'destroyActiveRow') {
    data = state.data.slice()
    data = data.filter(function (row) {
      return row.key !== state.activeRowKey
    })
    return xtend(state, {
      data: data
    })
  }

  // Update a cell's content with new content
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

// Initialize `virtual-app`
var render = app.start(modifier, initialState)

// Create our dom tree using the `virtual-app` render function
var domTree = render(function (state) {
  var GridComponent
  var FormComponent

  // Create the data-grid component state
  var gridState = {
    properties: state.properties,
    data: state.data,
    onclick: onGridClick
  }

  // Create the data-grid component
  GridComponent = grid(h, gridState)

  // If there is an active row in `state` create the data-form component
  // which will be used for editing the row's data.
  if (state.activeRowKey) {
    var activeRow

    // Find the active row's data using `state.activeRowKey`
    state.data.some(function (row) {
      if (row.key !== state.activeRowKey) return false
      activeRow = row
      return true
    })

    // Create the data-form component state
    var formState = {
      row: activeRow,
      properties: state.properties,
      activeColumnKey: state.activePropertyKey,
      onclose: onFormClose,
      ondestroy: onFormDestroyRow,
      oninput: onFormInput
    }

    // Create the data-form component
    FormComponent = form(h, formState)
  }

  // Return the dom tree
  return h('div#app', [
    GridComponent,
    FormComponent
  ])
})

/*
Event Handlers / Action Creators
 */

/**
 * Fire an action to set the active row key and property key
 * whenever the data-grid is clicked.
 * @param  {Object} event       Mouse Event
 * @param  {String} rowKey      Key of the row that was clicked
 * @param  {String} propertyKey Key of the property that was clicked
 */
function onGridClick (event, rowKey, propertyKey) {
  app.store({
    type: 'setActive',
    activeRowKey: rowKey,
    activePropertyKey: propertyKey
  })
}

/**
 * Fire an action when the user clicks the data-form `close` button.
 * @param  {Object} event Mouse event
 */
function onFormClose (event) {
  app.store({
    type: 'setActive',
    activeRowKey: null,
    activePropertyKey: null
  })
}

/**
 * Fire an action when the user clicks the data-form `destroy row` button.
 * @param  {Object} event Mouse event
 */
function onFormDestroyRow (event) {
  app.store({ type: 'destroyActiveRow' })
  app.store({
    type: 'setActive',
    activeRowKey: null,
    activePropertyKey: null
  })
}

/**
 * Fire an action whenever the user types into a data-form field.
 * @param  {Object} event       Mouse Event
 * @param  {String} rowKey      Row key
 * @param  {String} propertyKey Property/column key
 * @param  {String|Number} value Value of the field receiving input
 */
function onFormInput (event, rowKey, propertyKey, value) {
  app.store({
    type: 'updateCellContent',
    rowKey: rowKey,
    propertyKey: propertyKey,
    value: value
  })
}

// Place our dom tree into the dom
document.body.appendChild(domTree)
