import { LitElement, html, css } from 'lit-element'
import { ScrollbarStyles } from '@things-factory/shell'

import './data-grid-header'
import './data-grid-body'
import './data-grid-footer'

import { generateGutterColumn } from './gutters'

/**
 * DataGrid
 */
class DataGrid extends LitElement {
  constructor() {
    super()

    this.config = {}
    this.columns = []
    this.records = []
    this.total = 0
    this.page = 1
    this.limit = 10
    this.sorters = []

    this._gutters = []
  }

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
       *   pagination: {
       *     infinite: true | false (default),
       *     pages: [20, 30, 50, 100] (default) | [...number],
       *     footer: true | false
       *   },true (default) | false,
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
       *   }
       * }
       */
      config: Object,
      /**
       * @property
       *
       * Column : {
       *   type: 'string' (default) | 'number' | 'boolean',
       *   name: 'column name',
       *   width: sizeof column width as number,
       *   hidden: true | false,
       *   sortable: true | false or undefined (default),
       *   header: {
       *     renderer: 'column renderer' | function(column, records) | default function as undefined,
       *     decorator: 'column renderer' | function(column, records) | default function as undefined,
       *   },
       *   record: {
       *     renderer: 'column renderer' | function(column, records) | default function as undefined,
       *     editor: {
       *       type: 'string' (default) | 'number' | 'checkbox' | 'select' | 'tristate' | 'button' | 'user defined',
       *       option: array | object | function(item, records, column)
       *     },
       *     decorators: ['stripe'],
       *     align: 'left' | 'right' | 'center'
       *   }
       * }
       */
      columns: Array,
      records: Array,
      total: Number,
      page: Number,
      limit: Number,
      /**
       * @property
       *
       * Sorter : {
       *   name: 'column name',
       *   descending: undefined or false (default) | true
       * }
       */
      sorters: Array,
      _gutters: Array
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
  }

  updated(changes) {
    if (changes.has('config') || changes.has('columns')) {
      var gutters = this.config.gutters || []

      this._gutters = gutters.map(config => generateGutterColumn(config))

      /* 설명. 컬럼 모델 마지막에 'auto' 템플릿을 추가하여, 자투리 영역을 꽉 채워서 표시한다. */
      let gridTemplateColumns = [...this._gutters, ...this.columns]
        .filter(column => !column.hidden)
        .map((column, i, arr) => {
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

      this.style.setProperty('--grid-template-columns', gridTemplateColumns)
    }
  }

  render() {
    return html`
      <data-grid-header
        .gutters=${this._gutters}
        .config=${this.config}
        .columns=${this.columns}
        .sorters=${this.sorters}
      ></data-grid-header>

      <data-grid-body
        .gutters=${this._gutters}
        .config=${this.config}
        .columns=${this.columns}
        .records=${this.records}
        .page=${this.page}
        .limit=${this.limit}
        .total=${this.total}
      ></data-grid-body>

      <data-grid-footer
        .config=${this.config}
        .records=${this.records}
        .total=${this.total}
        .limit=${this.limit}
        .page=${this.page}
      ></data-grid-footer>
    `
  }
}

customElements.define('data-grid', DataGrid)
