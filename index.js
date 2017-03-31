var html = require('bel')
var css = require('sheetify')
var infiniteElements = require('infinite-elements')

module.exports = function createGrid (options) {
  var prefix = css`
    :host {
      position: relative;
      overflow-x: scroll;
      overflow-y: hidden;
      width: 100%;
      height: 100%;
    }

    .data-grid-cell {
      display: inline-block;
      font-size: 12px;
      border: 0px;
      padding: 0px 8px;
      margin: 0px;
      width: 150px;
      background: none;
      resize: none;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
    }
  `

  var headers = createHeaders(options)
  var rows = createRows(options)

  return function render (state) {
    var el = html`<div class="data-grid ${prefix}">
      ${headers(state)}
      ${rows(state)}
    </div>`
    el.style.height = (options.height + options.rowHeight * 2) + 'px'
    return el
  }
}

function createHeaders (options) {
  var rowHeight = options.rowHeight

  var prefix = css`
    :host {
      white-space: nowrap;
      margin: 0px;
      padding: 0px;
    }
  `

  var header = createHeader(options)

  function render (state) {
    var props = state.properties
    var keys = Object.keys(props)

    function prop (key) {
      return header(props[key])
    }

    var el = html`<ul class="data-grid-headers ${prefix}">
      ${keys.map(prop)}
    </ul>`

    el.style.height = rowHeight + 'px'
    return el
  }

  return render
}

function createHeader (options) {
  var rowHeight = options.rowHeight
  var onClickHeader = options.onClickHeader || function () {}

  var prefix = css`
    :host {
      width: 150px;
      line-height: 30px;
      padding: 0px 8px;
      display: inline-block;
      font-size: 15px;
      list-style-type: none;
      overflow-x: hidden;
      font-weight: 700;
      border-right: 1px solid #aaa;
      border-bottom: 1px solid #888;
      cursor: pointer;
    }
  `

  function render (state) {
    function onclick (e) {
      return onClickHeader(e, state)
    }

    var el =  html`<div class="data-grid-header ${prefix}" onclick=${onclick}>
      <span class="data-grid-header-key">${state.name}</span>
    </div>`

    el.style.height = rowHeight + 'px'
    return el
  }

  return render
}

function createRows (options) {
  console.time('data-grid:createRows')
  var height = options.height
  var rowHeight = options.rowHeight
  var onClickCell = options.onClickCell || function () {}

  var prefix = css`
    :host {
      margin: 0px;
      padding: 0px;
      overflow-y: scroll;
      position: absolute;
      white-space: nowrap;
      height: 100%;
    }
  `

  function row (data, index) {
    var value = data.value
    var cells = []
    var keys = Object.keys(value)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      var item = value[key]
      cells[i] = cell({ key: key, value: value[key] }, data)
    }

    var el = html`<div id="${data.key}" class="data-grid-row">
      ${cells}
    </div>`

    el.style['list-style-type'] = 'none'
    el.style.height = rowHeight + 'px'
    return el
  }

  function cell (state, row) {
    function onclick (e) {
      return onClickCell(e, row, state)
    }

    var el = html`<div id="${state.key}" class="data-grid-cell" onclick=${onclick}>
      ${state.value}
    </div>`

    el.style.height = rowHeight + 'px'
    el.style['line-height'] = rowHeight + 'px'
    el.style['max-height'] = rowHeight + 'px'
    el.style['min-height'] = rowHeight + 'px'
    return el
  }

  options.class = prefix
  options.eachRow = row
  var renderElements = infiniteElements(options)

  function render (state) {
    var rows = state.data
    var tree = renderElements(rows)
    console.timeEnd('data-grid:createRows')
    return tree
  }

  return render
}
