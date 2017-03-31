var html = require('yo-yo')
var css = require('sheetify')
var xtend = require('xtend')
var formatter = require('data-format')()
var formatted = formatter.format(require('./example-data.json'))
var createGrid = require('./index')

css('./example-styles.css', { global: true })

/*
* Create send function.
*/
var send = require('send-action')({
  onaction: onaction,
  onchange: onchange,
  state: {
    site: { title: 'data grid' },
    data: formatted.data,
    properties: formatted.properties
  }
})

/*
* Set up the action handler to modify state based on the actions triggered
*/
function onaction (state, action, data) {
  if (action === 'grid:click') {
    console.log('clicked', state)
  } else {
    return state
  }
}

/*
* Subscribe to changes to the store for rendering & logging
*/
function onchange (action, state, oldState) {
  html.update(document.getElementById('app'), render(state))
}

/*
Create the grid
*/
var grid = createGrid({
  height: window.innerHeight - 30,
  rowHeight: 30,
  onClickCell: onClickCell,
  onClickHeader: onClickHeader
})

function onClickHeader (e, header) {
  console.log('header', header)
  console.log('event', e)
  send('grid:click:header', {
    header: header
  })
}

function onClickCell (e, row, cell) {
  console.log('cell', cell)
  console.log('row', row)
  console.log('event', e)
  send('grid:click:cell', {
    row:row,
    cell:cell
  })
}

/*
* Render the html of the app with yo-yo
*/
function render (state) {
  return layout(state, send)
}

document.body.appendChild(render(send.state()))

/*
* Create a component to render
*/
function layout (state, send) {
  return html`<div id="app">
    ${grid(state)}
  </div>`
}

