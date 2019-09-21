import { LitElement, html, css } from 'lit-element'
import { longpressable } from '@things-factory/shell'
import { openPopup } from '@things-factory/layout-base'

import './data-list-gutter'
import '../record-view'

// TODO 로케일 설정에 따라서 포맷이 바뀌도록 해야한다.
const OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false
  // timeZone: 'America/Los_Angeles'
}

const formatter = new Intl.DateTimeFormat(navigator.language, OPTIONS)

export class RecordPartial extends LitElement {
  static get properties() {
    return {
      config: Object,
      record: Object,
      rowIndex: Number,
      selectedRow: {
        /*
         * row-selector를 사용자가 변경할 때, record-partial의 update를 유도하기 위해 selected-row attribute를 property에 추가함.
         * (이를 해주지 않으면, 리스트 refresh 경우에 selected-row checkbox가 클리어되지 않는 현상이 발생함.)
         */
        attribute: 'selected-row'
      }
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: row;
          align-items: center;
          border-bottom: var(--data-list-item-border-bottom);
        }

        :host > * {
          margin: var(--data-list-item-margin);
          zoom: 1.4;
        }

        [content] {
          flex: auto;
          display: block;
          zoom: 1;
        }

        [content] div {
          padding-top: 3px;
        }

        .name {
          font: var(--data-list-item-name-font);
          color: var(--data-list-item-name-color);
          text-transform: capitalize;
        }

        .desc {
          font: var(--data-list-item-disc-font);
          color: var(--data-list-item-disc-color);
        }

        .update-info {
          font: var(--data-list-item-etc-font);
          color: var(--data-list-item-etc-color);
        }

        .update-info mwc-icon {
          vertical-align: middle;
          font-size: 1em;
        }
      `
    ]
  }

  onFieldChange(e) {
    /* record-view의 이벤트를 부모에게로 전달한다. */
    this.dispatchEvent(
      new CustomEvent('field-change', {
        bubbles: true,
        composed: true,
        detail: e.detail
      })
    )
  }

  get recordView() {
    if (!this._recordView) {
      this._recordView = document.createElement('record-view')
      this._recordView.addEventListener('field-change', e => this.onFieldChange(e))
    }

    var columns = this.config.columns

    this._recordView.columns = columns
    this._recordView.record = this.record
    this._recordView.rowIndex = this.rowIndex
    this._recordView.translator = this.config.translator

    return this._recordView
  }

  firstUpdated() {
    /* long-press */
    longpressable(this.shadowRoot.querySelector('[content]'))

    this.shadowRoot.addEventListener('long-press', e => {
      var popup = openPopup(this.recordView, {
        backdrop: true,
        size: 'large',
        title: this.record['name']
      })

      popup.onclosed = () => {
        delete this._recordView
      }
    })
  }

  updated(changes) {
    if (changes.has('record') && this._recordView) {
      this._recordView.record = this.record
    }
  }

  render() {
    var record = this.record || {}
    var rowIndex = this.rowIndex

    var gutters = (this.config.columns || []).filter(column => column.type == 'gutter')

    return html`
      ${gutters.map(
        gutter =>
          html`
            <data-list-gutter
              .rowIndex=${rowIndex}
              .column=${gutter}
              .record=${record}
              .value=${gutter.translation ? this.config.translator(record[gutter.name]) : record[gutter.name]}
            ></data-list-gutter>
          `
      )}

      <div content>
        <div class="name">${record.name}</div>
        <div class="desc">${record.description}</div>
        ${record.updatedAt
          ? html`
              <div class="update-info">
                <mwc-icon>access_time</mwc-icon> Updated At : ${formatter.format(new Date(Number(record.updatedAt)))} /
                ${record.updaterId}
              </div>
            `
          : ``}
      </div>
    `
  }
}

customElements.define('record-partial', RecordPartial)
