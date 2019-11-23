import { LitElement, html } from 'lit-element'

import './data-report-field'

import { dataReportBodyKeydownHandler } from './event-handlers/data-report-body-keydown-handler'
import { dataReportBodyClickHandler } from './event-handlers/data-report-body-click-handler'
import { dataReportBodyDblclickHandler } from './event-handlers/data-report-body-dblclick-handler'

import { dataReportBodyStyle } from './data-report-body-style'

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

class DataReportBody extends LitElement {
  static get properties() {
    return {
      config: Object,
      columns: Array,
      data: Object,
      focused: Object
    }
  }

  static get styles() {
    return [dataReportBodyStyle]
  }

  render() {
    var { rows } = this.config
    var { groups } = rows
    groups = groups.reduce((sum, group) => {
      let column = this.columns.find(column => column.name == group)
      sum[group] = [group, 0, 0, null, column, null]
      return sum
    }, {})

    var { row: focusedRow = 0, column: focusedColumn = 0 } = this.focused || {}

    var columns = (this.columns || []).filter(column => !column.hidden && !groups[column.name])
    var data = this.data || {}
    var { records = [] } = data

    return html`
      ${records.map((record, idxRow) => {
        var attrFocusedRow = idxRow === focusedRow

        var $groups = []
        for (let group in groups) {
          var [groupname, begin, span, value, column] = groups[group]
          if (idxRow == 0) {
            groups[group] = [group, 1, 1, record[group], column, record]
          } else if (value !== record[group]) {
            $groups.push([group, begin, span, value, column, record])
            groups[group] = [group, idxRow + 1, 1, record[group], column, record]
          } else {
            groups[group] = [group, begin, span + 1, record[group], column, record]
          }
        }

        return html`
          ${columns.map(
            (column, idxColumn) => html`
              <data-report-field
                .data=${data}
                .rowIndex=${idxRow}
                .columnIndex=${idxColumn}
                .column=${column}
                .record=${record}
                ?gutter=${column.type == 'gutter'}
                ?focused-row=${attrFocusedRow}
                ?focused=${idxRow === focusedRow && idxColumn === focusedColumn}
                .value=${record[column.name]}
              ></data-report-field>
            `
          )}
          <data-report-field
            .data=${data}
            .rowIndex=${idxRow}
            .record=${record}
            ?focused-row=${attrFocusedRow}
          ></data-report-field>

          ${$groups.map(
            ([group, begin, span, value, column, record]) => html`
              <data-report-field
                .data=${data}
                .rowIndex=${begin - 1}
                .columnIndex=${5}
                .column=${column}
                .record=${record}
                ?focused-row=${begin <= focusedRow + 1 && begin + span - 1 > focusedRow}
                ?focused=${begin - 1 === focusedRow && 5 === focusedColumn}
                .value=${value}
                style="grid-column-start: 6;grid-column-end: span 1;grid-row-start: ${begin}; grid-row-end: span ${span};"
              ></data-report-field>
            `
          )}
          ${idxRow + 1 == records.length
            ? Object.values(groups).map(
                ([group, begin, span, value, column, record]) => html`
                  <data-report-field
                    .data=${data}
                    .rowIndex=${begin - 1}
                    .columnIndex=${5}
                    .column=${column}
                    .record=${record}
                    ?focused-row=${begin <= focusedRow + 1}
                    ?focused=${begin - 1 === focusedRow && 5 === focusedColumn}
                    .value=${value}
                    style="grid-column-start: 6;grid-column-end: span 1;grid-row-start: ${begin}; grid-row-end: span ${span};"
                  ></data-report-field>
                `
              )
            : html``}
        `
      })}
    `
  }

  firstUpdated() {
    /* focus() 를 받을 수 있도록 함. */
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
        this._focusedListener = dataReportBodyKeydownHandler.bind(this)
        window.addEventListener('keydown', this._focusedListener)
      }
    })

    this.shadowRoot.addEventListener('click', dataReportBodyClickHandler.bind(this))
    this.shadowRoot.addEventListener('dblclick', dataReportBodyDblclickHandler.bind(this))
  }

  updated(changes) {
    if (changes.has('focused')) {
      let element = this.shadowRoot.querySelector('[focused]')
      if (!element) {
        return
      }

      let { top, left } = calcScrollPos(this, element)
      // TODO this.scroll()을 사용하면, 효과가 좋으나 left 계산에 문제가 있는 것 같음.
      // this.scroll({
      //   top,
      //   left,
      //   behavior: 'smooth'
      // })
      if (top !== undefined) {
        this.scrollTop = top
      }
      if (left !== undefined) {
        this.scrollLeft = left
      }
    }
  }

  focus() {
    super.focus()

    if (!this.focused || this.focused.row === undefined) {
      this.focused = { row: 0, column: 0 }
    }
  }
}

customElements.define('data-report-body', DataReportBody)
