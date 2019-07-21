import { LitElement, html, css } from 'lit-element'

import './data-grid-field'

const KEY_LEFT = 37
const KEY_UP = 38
const KEY_RIGHT = 39
const KEY_DOWN = 40
const KEY_ENTER = 13
const KEY_TAP = 9
const KEY_BACKSPACE = 8

function calcScrollPos(parent, child) {
  /* getBoundingClientRect는 safari에서 스크롤 상태에서 다른 브라우저와는 다른 값을 리턴함 - 사파리는 약간 이상 작동함. */
  var { top: ct, left: cl, right: cr, bottom: cb } = child.getBoundingClientRect()
  var { top: pt, left: pl, right: pr, bottom: pb } = parent.getBoundingClientRect()
  var { scrollLeft, scrollTop } = parent
  var scrollbarWidth = parent.clientWidth - parent.offsetWidth
  var scrollbarHeight = parent.clientHeight - parent.offsetHeight

  return {
    left: cl < pl ? scrollLeft - (pl - cl) : cr > pr ? scrollLeft - (pr - cr) - scrollbarWidth : undefined,
    top: ct < pt ? scrollTop - (pt - ct) : cb > pb ? scrollTop - (pb - cb) - scrollbarHeight : undefined
  }
}

class DataGridBody extends LitElement {
  static get properties() {
    return {
      config: Object,
      columns: Array,
      data: Object,
      focused: Object,
      editTarget: Object,
      selectedRecords: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          grid-template-columns: var(--grid-template-columns);
          grid-auto-rows: var(--grid-record-height, min-content);

          overflow: auto;
          outline: none;
        }

        :host > [odd] {
          background-color: var(--grid-record-odd-background-color, #eee);
        }

        :host > [focused] {
          border: 1px dotted rgba(0, 0, 0, 0.5);
        }

        :host > [selected-row] {
          background-color: var(--grid-record-selected-background-color, orange);
        }

        :host > [focused-row] {
          background-color: var(--grid-record-focused-background-color, tomato);
        }

        :host > [editing] {
          background-color: var(--grid-record-editor-background-color, transparent);
        }
      `
    ]
  }

  render() {
    var { row: focusedRow, column: focusedColumn } = this.focused || {}
    var { row: editingRow, column: editingColumn } = this.editTarget || {}

    var columns = (this.columns || []).filter(column => !column.hidden)
    var { records = [] } = this.data || {}
    var selectedRecords = this.selectedRecords

    return html`
      ${records.map((record, idxRow) => {
        var attrSelectedRow = (selectedRecords || []).indexOf(record) != -1
        var attrFocusedRow = idxRow === focusedRow
        var attrOdd = idxRow % 2

        return html`
          ${columns.map(
            (column, idxColumn) => html`
              <data-grid-field
                .data=${this.data}
                .rowIndex=${idxRow}
                .columnIndex=${idxColumn}
                .column=${column}
                .record=${record}
                .selectedRecords=${selectedRecords}
                ?odd=${attrOdd}
                ?focused-row=${attrFocusedRow}
                ?selected-row=${attrSelectedRow}
                ?focused=${idxRow === focusedRow && idxColumn === focusedColumn}
                ?editing=${idxRow === editingRow && idxColumn === editingColumn}
              ></data-grid-field>
            `
          )}
          <data-grid-field
            ?odd=${attrOdd}
            ?focused-row=${attrFocusedRow}
            ?selected-row=${attrSelectedRow}
          ></data-grid-field>
        `
      })}
    `
  }

  firstUpdated() {
    this.setAttribute('tabindex', '-1')

    /*
     * focusout 으로 property를 변경시키는 경우, focusout에 의해 update가 발생하는 경우에는,
     * 그리드 내부의 컴포넌트가 갱신되는 현상을 초래하게 된다.
     * 따라서, focusout 핸들러에서 update를 유발하는 코드는 강력하게 금지시킨다.
     */
    this.addEventListener('focusout', e => {
      if (this._focusedListener) {
        window.removeEventListener('keydown', this._focusedListener)
        delete this._focusedListener
      }
    })

    this.addEventListener('focusin', e => {
      if (!this._focusedListener) {
        this._focusedListener = (async e => {
          if (this.editTarget) {
            return
          }
          // arrow-key
          var keyCode = e.keyCode
          var { row, column } = this.focused || {}
          var { records = [] } = this.data || {}
          var maxrow = records.length - 1
          var maxcolumn = (this.columns || []).filter(column => !column.hidden).length - 1

          switch (keyCode) {
            case KEY_UP:
              row = Math.max(0, row - 1)
              break
            case KEY_DOWN:
            case KEY_ENTER:
              row = Math.min(maxrow, row + 1)
              break
            case KEY_LEFT:
            case KEY_BACKSPACE:
              column = Math.max(0, column - 1)
              break
            case KEY_RIGHT:
            case KEY_TAP:
              column = Math.min(maxcolumn, column + 1)
              break

            default:
              return
          }

          this.focused = { row, column }

          /* arrow key에 의한 scrollbar의 자동 움직임을 하지 못하도록 한다. */
          e.preventDefault()

          await this.updateComplete

          this.showFocused()
        }).bind(this)

        window.addEventListener('keydown', this._focusedListener)
      }
    })

    this.shadowRoot.addEventListener('cell-click', async e => {
      let { row, column } = e.detail

      if (isNaN(row) || isNaN(column)) {
        return
      }

      if (this.focused && row == this.focused.row && column == this.focused.column) {
        return
      }

      this.focused = {
        row,
        column
      }

      this.editTarget = null

      await this.updateComplete

      this.showFocused()
    })

    this.shadowRoot.addEventListener('cell-dblclick', e => {
      let { row, column } = e.detail

      if (isNaN(row) || isNaN(column)) {
        return
      }

      if (this.editTarget && row == this.editTarget.row && column == this.editTarget.column) {
        return
      }

      this.editTarget = {
        row,
        column
      }
    })
  }

  showFocused() {
    let focused = this.shadowRoot.querySelector('[focused]')

    if (!focused) {
      return
    }

    let { top, left } = calcScrollPos(this, focused)

    if (top !== undefined) {
      this.scrollTop = top
    }
    if (left !== undefined) {
      this.scrollLeft = left
    }
  }
}

customElements.define('data-grid-body', DataGridBody)
