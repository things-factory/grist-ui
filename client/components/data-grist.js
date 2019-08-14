import { LitElement, html, css } from 'lit-element'

import { buildConfig } from './configure/config-builder'

import './data-grid/data-grid'
import './data-list/data-list'

import { DataProvider } from './data-provider'

const DEFAULT_DATA = {
  page: 1,
  limit: 20,
  total: 1,
  records: []
}

export class DataGrist extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        background-color: var(--grist-background-color);
        padding: var(--grist-padding);

        overflow: hidden;
      }

      data-grid,
      data-list {
        flex: 1;
      }

      data-list {
        overflow-y: auto;
      }
    `
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

  fetch() {
    if (this.dataProvider) {
      let { limit = 20, page = 1, infinite } = this._config.pagination
      let { sorters } = this._config

      if (infinite) {
        this.dataProvider.attach()
      } else {
        this.dataProvider.fetch({
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
          __seq__: (page - 1) * limit + idx + 1
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

  get dirtyRecords() {
    var { records = [] } = this.grist.data || {}
    return records.filter(record => record['__dirty__'])
  }

  get selected() {
    var { records = [] } = this._data || {}
    return records.filter(record => record['__selected__'])
  }

  focus() {
    super.focus()

    this.grist.focus()
  }

  commit() {
    this.data = this._data
  }
}

customElements.define('data-grist', DataGrist)
