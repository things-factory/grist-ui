import { LitElement, html, css } from 'lit-element'

import { buildConfig } from './configure/config-builder'
import { DataProvider } from './data-provider'

import './data-grid/data-grid'
import './data-list/data-list'

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
      dataProvider: Object,
      _data: Object,
      _config: Object
    }
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

  updated(changes) {
    if (changes.has('dataProvider')) {
      this._dataProvider = new DataProvider(this.dataProvider)
    }

    if (changes.has('config')) {
      this._config = buildConfig(this.config)
    }

    if (changes.has('data') || changes.has('selectedRecords')) {
      var { records } = this.data || {
        ...DEFAULT_DATA
      }

      if (this.selectedRecords) {
        records = [...records]

        this.selectedRecords.forEach(selected => {
          var index = records.indexOf(selected)
          records.splice(index, 1, {
            ...selected,
            __selected__: true
          })
        })
      }

      this._data = {
        ...DEFAULT_DATA,
        ...this.data,
        records
      }
    }
  }

  get grist() {
    return this.shadowRoot.querySelector('#grist')
  }

  get dirtyRecords() {
    var { records = [] } = this._data || {}
    return records.filter(record => record['__dirty__'])
  }

  get selected() {
    var { records = [] } = this._data || {}
    return records.filter(record => record['__selected__'])
  }
}

customElements.define('data-grist', DataGrist)
