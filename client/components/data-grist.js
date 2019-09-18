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

const DEFAULT_TRANSLATOR = function(x) {
  return x
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

  static get translator() {
    return DataGrist.__translator || DEFAULT_TRANSLATOR
  }

  static set translator(translator) {
    DataGrist.__translator = translator
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

  async fetch(reset = true) {
    if (reset) {
      /*
       * scroll 의 현재위치에 의해서 scroll 이벤트가 발생할 수 있으므로, 이를 방지하기 위해서 스크롤의 위치를 TOP으로 옮긴다.
       * (scroll 이 첫페이지 크기 이상으로 내려가 있는 경우, 첫페이지부터 다시 표시하는 경우에, scroll 이벤트가 발생한다.)
       */
      this.grist.scrollTop = 0
    }

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
      /* config에 translator가 설정되지 않으면, global translator를 적용한다. */
      var { translator = DataGrist.translator } = this.config

      this._config = buildConfig({
        ...this.config,
        translator: function(x) {
          try {
            return translator(x)
          } catch (e) {
            /* translator 오류에 대비함. */
            console.warn(e)
            return x
          }
        }
      })

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
          __seq__: this.mode == 'GRID' ? (page - 1) * limit + idx + 1 : idx + 1,
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

      /* update _data property intentionally */
      this.refresh()
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
    return records.filter(record => record['__dirty__'])
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

  refresh() {
    /* update _data property intentionally */
    this._data = {
      ...this._data
    }
  }
}

customElements.define('data-grist', DataGrist)
