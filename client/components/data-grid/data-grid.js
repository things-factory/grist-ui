import { LitElement, html, css } from 'lit-element'
import { ScrollbarStyles } from '@things-factory/shell'

import './data-grid-header'
import './data-grid-body'
import './data-grid-footer'
import { RecordFormHandler } from '../handlers/record-form-handler'

/**
 * DataGrid
 */
class DataGrid extends LitElement {
  static get properties() {
    return {
      /**
       * @property
       *
       * Config : {
       *   gutters: [
       *     {
       *       type: 'sequence',
       *       header: function(gutter) | 'string' | html-template,
       *       tooltip: 'string',
       *       handler: function(e)
       *     },
       *     {
       *       type: 'rowselector',
       *       header: function(gutter) | 'string' | html-template,
       *       tooltip: 'string',
       *       handler: function(e)
       *     },
       *     {
       *       type: 'button',
       *       header: function(gutter) | 'string' | html-template,
       *       tooltip: 'string',
       *       handler: function(e)
       *     }
       *   ],
       *   columns : [{
       *     type: 'string' (default) | 'number' | 'boolean' | 'gutter',
       *     name: 'column name',
       *     width: sizeof column width as number,
       *     resizable: true or undefined(default) | false,
       *     hidden: true | false,
       *     sortable: true | false or undefined (default),
       *     header: {
       *       renderer: 'column renderer' | function(column, records) | default function as undefined,
       *       decorator: 'column renderer' | function(column, records) | default function as undefined,
       *     },
       *     record: {
       *       renderer: 'column renderer' | function(column, records) | default function as undefined,
       *       editor: {
       *         type: 'string' (default) | 'number' | 'checkbox' | 'select' | 'tristate' | 'button' | 'user defined',
       *         option: array | object | function(item, records, column)
       *       },
       *       decorators: ['stripe'],
       *       align: 'left' | 'right' | 'center'
       *     }
       *   }],
       *   pagination: {
       *     infinite: true | false (default),
       *     pages: [20, 30, 50, 100] (default) | [...number],
       *     footer: true | false
       *   },
       *   sortable: true (default) | false,
       *   header: {
       *     renderer: 'column renderer' | function(column, records) | default function as undefined,
       *     decorators: ['stripe'],
       *   },
       *   record: {
       *     renderer: 'column renderer' | function(column, records, idx) | default function as undefined,
       *     editor: {
       *       type: 'string' (default) | 'number' | 'checkbox' | 'select' | 'tristate' | 'button' | 'user defined',
       *       option: array | object | function(item, records, column)
       *     },
       *     decorators: ['stripe'],
       *     align: 'left' | 'right' | 'center'
       *   },
       *   sorters : [{
       *     name: 'column name',
       *     descending: undefined or false (default) | true
       *   }]
       * }
       */
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

    this.addEventListener('select-all-change', e => {
      var { selected } = e.detail
      var { records } = this.data

      records.forEach(record => (record['__selected__'] = selected))
      this.data = { ...this.data }
    })

    this.addEventListener('select-record-change', e => {
      var { records: selectedRecords, added = [], removed = [] } = e.detail
      var { records } = this.data

      if (selectedRecords) {
        records.forEach(record => (record['__selected__'] = false))
        selectedRecords.forEach(record => (record['__selected__'] = true))
      } else {
        removed.forEach(record => (record['__selected__'] = false))
        added.forEach(record => (record['__selected__'] = true))
      }

      this.data = { ...this.data }
    })

    this.addEventListener('record-change', e => {
      var { after, before, column, row } = e.detail

      var records = this.data.records
      records.splice(row, 1, after)
      this.data = {
        ...this.data,
        records
      }
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
