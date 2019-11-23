import { LitElement, html, css } from 'lit-element'

import { buildConfig } from './configure/config-builder'

import './data-report/data-report-component'

import { DataProvider } from './data-provider'

import { pulltorefresh } from '@things-factory/shell'

const DEFAULT_DATA = {
  page: 1,
  limit: 20,
  total: 1,
  records: []
}

export class DataReport extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          background-color: var(--report-background-color);
          padding: var(--report-padding);
          min-height: 120px;

          overflow: hidden;

          /* for pulltorefresh controller */
          position: relative;
        }

        data-report-component {
          flex: 1;
        }

        oops-spinner {
          display: none;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        oops-spinner[show] {
          display: block;
        }

        oops-note {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `
    ]
  }

  static get properties() {
    return {
      config: Object,
      data: Object,
      selectedRecords: Array,
      fetchHandler: Object,
      fetchOptions: Object,
      _data: Object,
      _config: Object,
      _showSpinner: Boolean
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
    if (this.fetchHandler) {
      /* TODO 그리드 초기에는 fetchHandler가 설정되지 않았다가, 나중에 설정되는 경우에 대한 대응 */
      pulltorefresh({
        container: this.shadowRoot,
        scrollable: this.report,
        refresh: () => {
          return this.fetch(true)
        }
      })
    }
  }

  render() {
    var oops = !this._showSpinner && (!this._data || !this._data.records || this._data.records.length == 0)

    return html`
      ${oops
        ? html`
            <oops-note icon="list" title="EMPTY LIST" description="There are no records to be shown"></oops-note>
          `
        : html``}

      <data-report-component id="report" .config=${this._config} .data=${this._data}> </data-report-component>

      <oops-spinner ?show=${this._showSpinner}></oops-spinner>
    `
  }

  async fetch(reset = true) {
    if (!this._config) {
      /* avoid to be here */
      console.warn('report is not configured yet.')
      return
    }

    if (reset) {
      /*
       * scroll 의 현재위치에 의해서 scroll 이벤트가 발생할 수 있으므로, 이를 방지하기 위해서 스크롤의 위치를 TOP으로 옮긴다.
       * (scroll 이 첫페이지 크기 이상으로 내려가 있는 경우, 첫페이지부터 다시 표시하는 경우에, scroll 이벤트가 발생한다.)
       */
      this.report.scrollTop = 0
    }

    if (this.dataProvider) {
      await this.dataProvider.attach(reset)
    }
  }

  updated(changes) {
    if (changes.has('config')) {
      this._config = buildConfig({
        ...this.config
      })

      this.dataProvider.sorters = this._config.sorters
      this.fetch()
    }

    if (changes.has('fetchHandler')) {
      this.dataProvider.fetchHandler = this.fetchHandler
    }

    if (changes.has('fetchOptions')) {
      this.dataProvider.fetchOptions = this.fetchOptions
    }

    if (changes.has('data')) {
      this.reset()
    }
  }

  get report() {
    return this.shadowRoot.querySelector('#report')
  }

  showSpinner() {
    this._showSpinner = true
  }

  hideSpinner() {
    this._showSpinner = false
  }

  focus() {
    super.focus()

    this.report.focus()
  }

  refresh() {
    this.requestUpdate()
    /* FIXME - this.requestUpdate()로 대체 */
    /* update _data property intentionally */
    // this._data = {
    //   ...this._data
    // }
  }

  reset() {
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
}

customElements.define('data-report', DataReport)
