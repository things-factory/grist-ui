import { LitElement, html, css } from 'lit-element'
import { longpressable } from '@things-factory/shell'
import { openPopup } from '@things-factory/layout-base'

import './data-list-gutter'
import '../record-view'

const STYLE = 'width: 100vw;height: 100vh'

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
          zoom: 1.3;
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

  firstUpdated() {
    /* long-press */
    longpressable(this.shadowRoot.querySelector('[content]'))

    this.shadowRoot.querySelector('[content]').addEventListener('click', e => {
      var partial = e.target
      var columns = this.config.columns
      var { record, rowIndex } = partial

      openPopup(
        html`
          <record-form style=${STYLE} .columns=${columns} .record=${record} .rowIndex=${rowIndex}></record-form>
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
          <record-view style=${STYLE} .columns=${columns} .record=${record} .rowIndex=${rowIndex}></record-view>
        `,
        {
          backdrop: true
        }
      )
    })
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
              .value=${record[gutter.name]}
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
