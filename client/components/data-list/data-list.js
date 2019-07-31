import { LitElement, html, css } from 'lit-element'
import { openPopup } from '@things-factory/layout-base'

import { longpressable } from '../../utils/longpressable'
import '../record-view'
import './record-partial'

const STYLE = 'width: 100vw;height: 100vh'

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
      `
    ]
  }

  firstUpdated(changes) {
    /* infinite scrolling */
    this.addEventListener('scroll', e => {
      const totalScrollHeight = this.scrollHeight
      const screenHeight = this.offsetHeight
      const currentScrollTop = this.scrollTop

      if (totalScrollHeight == screenHeight + currentScrollTop) {
        /* 마지막 페이지까지 계속 페이지를 증가시킨다. */
        var lastPage = Math.ceil(this._total / this._limit)

        if (this.page < lastPage) {
          this.dispatchEvent(new CustomEvent('page-changed', { bubbles: true, composed: true, detail: this.page + 1 }))
        }
      }
    })

    /* long-press */
    longpressable(this.shadowRoot)

    this.shadowRoot.addEventListener('click', e => {
      var partial = e.target
      var columns = this.config.columns
      var { record, rowIndex } = partial

      openPopup(
        html`
          <record-form
            style=${STYLE}
            .columns=${columns}
            .column=${columns[0]}
            .record=${record}
            .rowIndex=${rowIndex}
          ></record-form>
        `,
        {
          backdrop: true
        }
      )
    })

    this.shadowRoot.addEventListener('long-press', e => {
      var partial = e.target
      var columns = this.config.columns
      var { record, rowIndex } = partial

      openPopup(
        html`
          <record-view
            style=${STYLE}
            .columns=${columns}
            .column=${columns[0]}
            .record=${record}
            .rowIndex=${rowIndex}
          ></record-view>
        `,
        {
          backdrop: true
        }
      )
    })
  }

  updated(changes) {
    if (changes.has('config')) {
      this._records = []
      this.page = 0
    }

    if (changes.has('data')) {
      this._records = (this._records || []).concat((this.data && this.data.records) || [])
      this._total = this.data.total
      this._limit = this.data.limit
      this.page = this.data.page
    }
  }

  render() {
    var records = this._records || []
    return html`
      ${records.map(
        (record, rowIndex) => html`
          <record-partial .record=${record} .rowIndex=${rowIndex}></record-partial>
        `
      )}
      <record-partial .rowIndex=${records.length}></record-partial>
    `
  }
}

customElements.define('data-list', DataList)
