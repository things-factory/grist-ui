import { LitElement, html, css } from 'lit-element'

import './record-partial'

class DataList extends LitElement {
  static get properties() {
    return {
      config: Object,
      data: Object,
      _records: Array
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
          background-color: black;
        }
      `
    ]
  }

  firstUpdated(changes) {
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
            column,
            row
          }
        })
      )
    })
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

    return html`
      ${records.map(
        (record, rowIndex) => html`
          <record-partial
            .config=${this.config}
            .record=${record}
            .rowIndex=${rowIndex}
            ?selected-row=${record['__selected__']}
          ></record-partial>
        `
      )}
    `
  }
}

customElements.define('data-list', DataList)
