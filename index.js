var el = require('yo-yo')
var css = require('sheetify')
var domcss = require('dom-css')

/*
* Experiment with yo-yo.js
* Based on https://github.com/shama/csv-viewer
*/

module.exports = function createDataGrid (options) {
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

  function render (state, send) {
    return el`<div class="data-grid ${prefix}">
      ${headers(state, send)}
      ${rows(state, send)}
    </div>`
  }

  return render
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

    return el`<ul class="data-grid-headers ${prefix}">
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
    return el`<li class="data-grid-header ${prefix}">
      <span class="data-grid-header-name">${state.name}</span>
    </li>`
  }

  return render
}

function createRows (options) {
  var height = options.height || 300
  var rowHeight = options.rowHeight || 30
  var scrollTop = 0
  var visibleStart = 0
  var visibleEnd = 0
  var displayStart = 0
  var displayEnd = 0

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
    var section = slice(state.data, scrollTop)

    function eachrow (data) {
      return row(data, send)
    }

    function onscroll () {
      var section = slice(state.data, this.scrollTop)
      el.update(document.querySelector('.data-grid-rows'), element(section))
    }

    function element (rows) {
      return el`<ul class="data-grid-rows ${prefix}" onscroll=${onscroll}>
        ${toprow()}
        ${rows.map(eachrow)}
        ${bottomrow(rows.length)}
      </div>`
    }

    return element(section)
  }

  function slice (rows, scrollTop) {
    console.log('rows?', rows.length)
    var total = rows.length
    var rowsPerBody = Math.floor((height - 2) / rowHeight)
    visibleStart = Math.round(Math.floor(scrollTop / rowHeight))
    visibleEnd = Math.round(Math.min(visibleStart + rowsPerBody))
    displayStart = Math.round(Math.max(0, Math.floor(scrollTop / rowHeight) - rowsPerBody * 1.5))
    displayEnd = Math.round(Math.min(displayStart + 4 * rowsPerBody, total))
    return rows.slice(displayStart, displayEnd)
  }

  function toprow () {
    var row = el`<li></li>`
    domcss(row, {
      height: displayStart * rowHeight,
      listStyleType: 'none'
    })
    return row
  }

  function bottomrow (totalRows) {
    var row = el`<li></li>`
    domcss(row, {
      height: (totalRows - displayEnd) * rowHeight,
      listStyleType: 'none'
    })
    return row
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
    return cell(data.value[key], send)
  }

  return el`<li class="data-grid-row ${prefix}">
    ${cells.map(eachcell)}
  </li>`
}

function cell (state, send) {
  var prefix = css`
    :host {
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
      overflow: hidden;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
  `

  return el`<textarea class="data-grid-cell ${prefix}" value=${state} row=1>${state}</textarea>`
}
