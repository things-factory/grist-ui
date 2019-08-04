import { LitElement, html, css } from 'lit-element'
import { ScrollbarStyles } from '@things-factory/shell'

import './data-grid-header'
import './data-grid-body'
import './data-grid-footer'

/**
 * DataGrid
 */
class DataGrid extends LitElement {
  static get properties() {
    return {
      config: Object,
      data: Object
    }
  }

  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          overflow: hidden;

          border: 1px solid var(--grid-header-border-color);
          border-radius: 4px;
        }

        data-grid-body {
          flex: 1;
        }
      `
    ]
  }

  get body() {
    return this.shadowRoot.querySelector('data-grid-body')
  }

  get header() {
    return this.shadowRoot.querySelector('data-grid-header')
  }

  firstUpdated() {
    /* header and body scroll synchronization */
    this.header.addEventListener('scroll', e => {
      if (this.body.scrollLeft !== this.header.scrollLeft) {
        this.body.scrollLeft = this.header.scrollLeft
      }
    })

    this.body.addEventListener('scroll', e => {
      if (this.body.scrollLeft !== this.header.scrollLeft) {
        this.header.scrollLeft = this.body.scrollLeft
      }
    })

    /* record selection processing */
    this.addEventListener('select-all-change', e => {
      var { selected } = e.detail
      var { records } = this.data

      records.forEach(record => (record['__selected__'] = selected))
      this.data = { ...this.data }
    })

    this.addEventListener('select-record-change', e => {
      var { records: selectedRecords, added = [], removed = [] } = e.detail
      var { records } = this.data
      var { selectable = false } = this.config.rows

      if (!records || !selectable) {
        return
      } else if (selectable && !selectable.multiple) {
        records.forEach(record => (record['__selected__'] = false))
      }

      if (selectedRecords) {
        records.forEach(record => (record['__selected__'] = false))
        selectedRecords.forEach(record => (record['__selected__'] = true))
      } else {
        removed.forEach(record => (record['__selected__'] = false))
        added.forEach(record => (record['__selected__'] = true))
      }

      this.data = {
        ...this.data,
        records: [...records]
      }
    })

    /* field change processing */
    this.addEventListener('field-change', e => {
      var { after, before, column, record, row } = e.detail

      /* compare changes */
      if (after === before) {
        return
      }

      // TODO 오브젝트나 배열 타입인 경우 deepCompare 후에 변경 적용 여부를 결정한다.

      /* 빈 그리드로 시작한 경우, data 설정이 되어있지 않을 수 있다. */
      var records = this.data.records || []

      var beforeRecord = records[row]
      var afterRecord = beforeRecord
        ? {
            __dirty__: 'M',
            ...beforeRecord,
            [column.name]: after
          }
        : {
            __dirty__: '+',
            [column.name]: after
          }

      // TODO 레코드의 deepCompare 후에 변경 여부를 결정한다.
      // before와 after의 비교
      // origin record와 after의 비교에 의해서 __dirty__ flag의 수정이 필요할 수 있다.

      if (beforeRecord) {
        records.splice(row, 1, afterRecord)
      } else {
        records.push(afterRecord)
      }

      this.data = {
        ...this.data,
        records: [...records]
      }

      this.dispatchEvent(
        new CustomEvent('record-change', {
          bubbles: true,
          composed: true,
          detail: {
            before: beforeRecord,
            after: afterRecord,
            column: column
          }
        })
      )
    })
  }

  updated(changes) {
    if (changes.has('config') || changes.has('data')) {
      /*
       * 데이타 내용에 따라 동적으로 컬럼의 폭이 달라지는 경우(예를 들면, sequence field)가 있으므로,
       * data의 변동에 대해서도 다시 계산되어야 한다.
       */
      this.calculateWidths(this.config && this.config.columns)
    }
  }

  calculateWidths(columns) {
    /*
     * 컬럼 모델 마지막에 'auto' cell을 추가하여, 자투리 영역을 꽉 채워서 표시한다.
     */
    this._widths = (columns || [])
      .filter(column => !column.hidden)
      .map(column => {
        switch (typeof column.width) {
          case 'number':
            return column.width + 'px'
          case 'string':
            return column.width
          case 'function':
            return column.width.call(this, column)
          default:
            return 'auto'
        }
      })
      .concat(['auto'])
      .join(' ')

    this.style.setProperty('--grid-template-columns', this._widths)
  }

  render() {
    var { pagination = {}, columns = [] } = this.config || {}

    var paginatable = !pagination.infinite
    var data = this.data

    return html`
      <data-grid-header
        .config=${this.config}
        .columns=${columns}
        .data=${data}
        @column-width-changed=${e => {
          let { idx, width } = e.detail
          columns[idx].width = width
          this.calculateWidths(columns)
        }}
      ></data-grid-header>

      <data-grid-body .config=${this.config} .columns=${columns} .data=${data}></data-grid-body>

      ${paginatable
        ? html`
            <data-grid-footer .config=${this.config} .data=${data}></data-grid-footer>
          `
        : html``}
    `
  }
}

customElements.define('data-grid', DataGrid)
