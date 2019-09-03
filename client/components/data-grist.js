import { LitElement, html, css } from 'lit-element'

import { buildConfig } from './configure/config-builder'

import './data-grid/data-grid'
import './data-list/data-list'

import { DataProvider } from './data-provider'

import { pulltorefresh } from '@things-factory/shell'

const DEFAULT_DATA = {
  page: 1,
  limit: 20,
  total: 1,
  records: []
}

export class DataGrist extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          background-color: var(--grist-background-color);
          padding: var(--grist-padding);

          overflow: hidden;

          /* for pulltorefresh controller */
          position: relative;
        }

        data-grid,
        data-list {
          flex: 1;
        }

        data-list {
          overflow-y: auto;
        }
      `
    ]
  }

  static get properties() {
    return {
      mode: String,
      config: Object,
      data: Object,
      selectedRecords: Array,
      fetchHandler: Object,
      fetchOptions: Object,
      editHandler: Object,
      _data: Object,
      _config: Object
    }
  }

  connectedCallback() {
    super.connectedCallback()

    this.dataProvider = new DataProvider(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.dataProvider.dispose()
  }

  firstUpdated() {
    pulltorefresh({
      container: this.shadowRoot,
      scrollable: this.grist,
      refresh: () => {
        return this.fetch(true)
      }
    })
  }

  render() {
    return html`
      ${this.mode == 'GRID'
        ? html`
            <data-grid id="grist" .config=${this._config} .data=${this._data}> </data-grid>
          `
        : html`
            <data-list id="grist" .config=${this._config} .data=${this._data}> </data-list>
          `}
    `
  }

  async fetch(reset = false) {
    if (this.dataProvider) {
      let { limit = 20, page = 1, infinite } = this._config.pagination
      let { sorters } = this._config

      if (infinite || this.mode !== 'GRID') {
        await this.dataProvider.attach(reset)
      } else {
        await this.dataProvider.fetch({
          limit,
          page,
          sorters
        })
      }
    }
  }

  updated(changes) {
    if (changes.has('config')) {
      this._config = buildConfig(this.config)
      this.dataProvider.sorters = this._config.sorters
      this.fetch()
    }

    if (changes.has('fetchHandler')) {
      this.dataProvider.fetchHandler = this.fetchHandler
    }

    if (changes.has('editHandler')) {
      this.dataProvider.editHandler = this.editHandler
    }

    if (changes.has('fetchOptions')) {
      this.dataProvider.fetchOptions = this.fetchOptions
    }

    if (changes.has('data')) {
      var { limit = DEFAULT_DATA.limit, page = DEFAULT_DATA.page, total = DEFAULT_DATA.total, records = [] } = this.data

      /* 원본 데이타를 남기고, 복사본(_data)을 사용한다. */
      records = records.map((record, idx) => {
        return {
          ...record,
          __seq__: (page - 1) * limit + idx + 1,
          __origin__: record
        }
      })

      this._data = {
        limit,
        page,
        total,
        records
      }
    }

    if (changes.has('selectedRecords')) {
      var { records } = this.data || []
      var selectedRecords = this.selectedRecords || []

      var _records = this._data.records

      /* 원본데이타에서 index를 찾아서, 복사본 데이타의 selected를 설정한다. */
      selectedRecords.forEach(selected => {
        var index = records.indexOf(selected)
        var record = _records[index]
        if (record) {
          record['__selected__'] = true
        }
      })

      this._data = {
        ...this._data
      }
    }
  }

  get grist() {
    return this.shadowRoot.querySelector('#grist')
  }

  get dirtyData() {
    return this.grist.data || {}
  }

  get dirtyRecords() {
    var { records = [] } = this.dirtyData
    // const editableColumns = [
    //   'id',
    //   '__dirty__',
    //   ...this.grist.config.columns.filter(column => column.record.editable).map(column => column.name)
    // ]
    return records.filter(record => record['__dirty__'])
    // .map(record => {
    //   let dirtyRecord = {}
    //   for (let key in record) {
    //     if (editableColumns.includes(key)) {
    //       dirtyRecord[key] = record[key]
    //     }
    //   }

    //   return dirtyRecord
    // })
  }

  get selected() {
    var { records = [] } = this.grist.data || {}
    return records.filter(record => record['__selected__'])
  }

  focus() {
    super.focus()

    this.grist.focus()
  }

  commit() {
    var { page, total, limit, records } = this.grist.data

    this.data = {
      page,
      total,
      limit,
      records: records.map(record => {
        var copied = {
          ...record
        }

        delete copied.__seq__
        delete copied.__dirty__
        delete copied.__selected__
        delete copied.__changes__
        delete copied.__dirtyfields__
        delete copied.__origin__

        return copied
      })
    }
  }
}

customElements.define('data-grist', DataGrist)
