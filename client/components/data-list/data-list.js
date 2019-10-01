import { LitElement, html, css } from 'lit-element'
import '@material/mwc-fab'
import '@material/mwc-icon'
import './record-partial'

import { dataListClickHandler } from './event-handlers/data-list-click-handler'
import { dataListDblclickHandler } from './event-handlers/data-list-dblclick-handler'

class DataList extends LitElement {
  static get properties() {
    return {
      config: Object,
      data: Object,
      _records: Array,
      isTop: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          background-color: var(--data-list-background-color);
          overflow-y: auto;
        }

        :nth-child(even) {
          background-color: #fff;
        }

        [selected-row] {
          background-color: var(--data-list-selected-background-color);
        }

        #create {
          position: absolute;
          bottom: var(--data-list-fab-position-vertical);
          right: var(--data-list-fab-position-horizontal);
          background-color: transparent;
          opacity: 0.85;
        }

        #upward {
          --mdc-icon-size: 26px;
          position: absolute;
          top: var(--data-list-fab-position-vertical);
          right: var(--data-list-fab-position-horizontal);
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 20px;
          color: var(--data-list-fab-color);
          box-shadow: var(--data-list-fab-shadow);
          padding: 7px;
        }
      `
    ]
  }

  firstUpdated(changes) {
    this.isTop = true

    /* infinite scrolling */
    this.addEventListener('scroll', e => {
      const totalScrollHeight = this.scrollHeight
      const screenHeight = this.offsetHeight
      const currentScrollTop = this.scrollTop

      if (totalScrollHeight <= screenHeight + currentScrollTop + 1) {
        /* 마지막 페이지까지 계속 페이지를 증가시킨다. */
        var lastPage = Math.ceil(this._total / this._limit)

        if (this._page < lastPage) {
          this.dispatchEvent(new CustomEvent('attach-page', { bubbles: true, composed: true }))
        }
      }

      this.isTop = this.scrollTop == 0
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

      this.requestUpdate()
    })

    /* field change processing */
    this.addEventListener('field-change', e => {
      var { after, before, column, record, row } = e.detail

      /* compare changes */
      if (after === before) {
        return
      }

      var validation = column.validation
      if (validation && typeof (validation == 'function')) {
        if (!validation.call(this, after, before, record, column)) {
          return
        }
      }

      this.onRecordChanged({ [column.name]: after }, row, column)
    })

    /* record reset processing */
    this.addEventListener('record-reset', e => {
      var { record, row } = e.detail

      this.onRecordChanged(record['__origin__'], row, null)
    })

    this.shadowRoot.addEventListener('click', dataListClickHandler.bind(this))

    this.shadowRoot.addEventListener('dblclick', dataListDblclickHandler.bind(this))
  }

  onRecordChanged(recordData, row, column /* TODO column should be removed */) {
    // TODO 오브젝트나 배열 타입인 경우 deepCompare 후에 변경 적용 여부를 결정한다.

    /* 빈 그리드로 시작한 경우, data 설정이 되어있지 않을 수 있다. */
    var records = this.data.records || []

    var beforeRecord = records[row]
    var afterRecord = beforeRecord
      ? {
          __dirty__: 'M',
          ...beforeRecord,
          ...recordData
        }
      : {
          __dirty__: '+',
          ...recordData
        }

    if (beforeRecord) {
      records.splice(row, 1, afterRecord)
    } else {
      records.push(afterRecord)
    }

    this.dispatchEvent(
      new CustomEvent('record-change', {
        bubbles: true,
        composed: true,
        detail: {
          before: beforeRecord,
          after: afterRecord,
          column,
          row
        }
      })
    )
  }

  updated(changes) {
    if (changes.has('config')) {
      this._records = []
      this._page = 1
    }

    if (changes.has('data')) {
      this._records = this.data.records
      this._total = this.data.total
      this._limit = this.data.limit
      this._page = this.data.page
    }
  }

  render() {
    var records = this._records || []

    /* 이 경우는 새로운 레코드를 생성할 때, 가상의 빈 레코드를 추가해주는 작업이다. */
    if (this._wannaCreateNewRecord) {
      records = [...records, { __dirty__: '+' }]
    }

    return html`
      ${records.map(
        (record, rowIndex) => html`
          <record-partial
            .config=${this.config}
            .record=${record}
            .rowIndex=${rowIndex}
            ?selected-row=${record['__selected__']}
            ?dirty=${record['__dirty__']}
          ></record-partial>
        `
      )}
      ${this.isTop
        ? html``
        : html`
            <mwc-icon id="upward" @click=${e => this.gotoTop(e)}>arrow_upward</mwc-icon>
          `}

      <a
        id="create"
        href="#"
        @click=${e => {
          this.createNewRecord()

          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <mwc-fab mini icon="add" title="create"></mwc-fab>
      </a>
    `
  }

  gotoTop(e) {
    this.scrollTop = 0

    e.stopPropagation()
  }

  async createNewRecord() {
    this._wannaCreateNewRecord = true

    await this.requestUpdate()

    var newRecord = this.shadowRoot.querySelector('record-partial:last-of-type')
    if (newRecord) {
      newRecord.popupRecordView()
    }

    this._wannaCreateNewRecord = false
  }
}

customElements.define('data-list', DataList)
