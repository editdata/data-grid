var createElement = require('virtual-dom/create-element')
var h = require('virtual-dom/h')
var diff = require('deep-diff')
var ViewList = require('view-list')
var RowsComponent = require('./rows')
var PropertiesComponent = require('./properties')

var DataGrid = function (state) {
  if (!(this instanceof DataGrid)) return new DataGrid(state)
  this.state = state
  this.state.h = h

  // Initialize Rows
  var rowHeight = state.rowHeight || 30
  var height = window.innerHeight - rowHeight

  var rowsOptions = {
    readonly: state.readonly,
    data: state.data,
    rowHeight: state.rowHeight,
    onfocus: state.onfocus,
    onblur: state.onblur,
    onclick: state.onclick,
    oninput: state.oninput,
    properties: state.properties,
    activeRowKey: state.activeRowKey,
    activePropertyKey: state.activePropertyKey,
    h: h
  }

  this.viewList = ViewList({
    className: 'data-grid-rows',
    rowHeight: rowHeight,
    eachrow: RowsComponent(rowsOptions),
    readonly: true,
    height: height
  })

  // Initialize Properties
  var propertiesOptions = {
    properties: state.properties,
    onmouseover: state.onmouseover,
    onmouseout: state.onmouseout,
    onconfigure: state.onconfigure,
    h: h
  }

  this.properties = PropertiesComponent(propertiesOptions)
}

DataGrid.prototype.type = 'Widget'

DataGrid.prototype.init = function () {
  var state = this.state

  this.Rows = this.viewList.render(state.data)
  // HACK: Virtual-dom's diffing gets caught in infinite loop without key
  this.Rows.key = Math.random()

  var el = createElement(h('div#data-grid', [
    this.properties,
    this.Rows
  ]))

  return el
}

DataGrid.prototype.update = function (prev, el) {
  var rowsDiff = diffRows(this.state, prev.state)
  var propertiesDiff = diffProperties(this.state, prev.state)

  if (!rowsDiff && !propertiesDiff) return

  if (rowsDiff) {
    var oldRows = el.querySelector('.data-grid-rows')
    var newRows = createElement(this.viewList.render(this.state.data))
    oldRows.parentElement.replaceChild(newRows, oldRows)

    if (!this.state.activeRowKey && prev.state.activeRowKey) {
      var prevActiveRow = newRows.querySelector('li[data-key="' + prev.state.activeRowKey + '"]')
      if (prevActiveRow) newRows.scrollTop = prevActiveRow.offsetTop
    }

    if (this.state.activeRowKey) {
      var activeRow = newRows.querySelector('.active')
      if (activeRow) newRows.scrollTop = activeRow.offsetTop
    }
  }

  if (propertiesDiff) {
    var oldProperties = el.querySelector('.data-grid-properties')
    var newProperties = createElement(PropertiesComponent(this.state))
    oldProperties.parentElement.replaceChild(newProperties, oldProperties)
  }
}

DataGrid.prototype.destroy = function destroy (el) {}

function diffRows (state, prev) {
  var previousRowsState = {
    data: prev.data,
    activeRowKey: prev.activeRowKey,
    activePropertyKey: prev.activePropertyKey
  }

  var newRowsState = {
    data: state.data,
    activeRowKey: state.activeRowKey,
    activePropertyKey: state.activePropertyKey
  }

  return diff(previousRowsState, newRowsState)
}

function diffProperties (state, prev) {
  return diff(state.properties, prev.properties)
}

module.exports = DataGrid
