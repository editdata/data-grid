var html = require('yo-yo')
var css = require('sheetify')

module.exports = function createDataGrid (options) {
  options = options || {}

  var headers = createHeaders(options)
  var rows = createRows(options)

  var prefix = css`
    :host {
      height: 100%;
      position: relative;
      overflow-x: scroll;
      overflow-y: hidden;
    }
  `

  return function render (state, send) {
    return html`<div class="data-grid ${prefix}">
      ${headers(state, send)}
      ${rows(state, send)}
    </div>`
  }
}

function createHeaders (options) {
  var prefix = css`
    :host {
      white-space: nowrap;
      margin: 0px;
      padding: 0px;
      height: 30px;
    }
  `

  var header = createHeader(options)

  function render (state, send) {
    var props = state.properties
    var keys = Object.keys(props)

    function prop (key) {
      return header(props[key], send)
    }

    return html`<ul class="data-grid-headers ${prefix}">
      ${keys.map(prop)}
    </ul>`
  }

  return render
}

function createHeader (options) {
  var prefix = css`
    :host {
      width: 150px;
      height: 30px;
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

  function render (state, send) {
    return html`<li class="data-grid-header ${prefix}">
      <span class="data-grid-header-name">${state.name}</span>
    </li>`
  }

  return render
}

function createRows (options) {
  var height = options.height || 300
  var rowHeight = options.rowHeight || 30
  var action = options.action
  var error = options.error

  var prefix = css`
    :host {
      margin: 0px;
      padding: 0px;
      overflow-y: scroll;
      position: absolute;
      white-space: nowrap;
      height: 100%;
      margin-bottom: 30px;
    }
  `

  function render (state, send) {
    function eachrow (data) {
      return row(data, send)
    }

    function element (section) {
      return html`<ul class="data-grid-rows ${prefix}" onscroll=${onscroll}>
        ${section.map(eachrow)}
      </div>`
    }

    return element(state.data)
  }

  return render
}

function row (data, send) {
  var prefix = css`
    :host {
      list-style-type: none;
      height: 30px;
    }
  `

  var cells = Object.keys(data.value)
  function eachcell (key) {
    return cell({ key: key, value: data.value[key] }, send)
  }

  return html`<li class="data-grid-row ${prefix}">
    ${cells.map(eachcell)}
  </li>`
}

function cell (state, send) {
  var prefix = css`
    :host {
      display: inline-block;
      font-size: 12px;
      border: 0px;
      padding: 0px 8px;
      margin: 0px;
      width: 150px;
      height: 30px;
      max-height: 30px;
      min-height: 30px;
      line-height: 30px;
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

  function oninput (e) {
    send('input', { key: state.key, value: e.target.value })
  }

  function onclick (e) {
    send('click', { key: state.key, value: e.target.value })
  }

  return html`<div 
    class="data-grid-cell ${prefix}"
    value=${state.value}
    onclick=${onclick}
    oninput=${oninput}
    row="1"
    >${state.value}</div>`
}
