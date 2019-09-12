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
    var { after, before, column, record, row } = e.detail

    /* compare changes */
    if (after === before) {
      return
    }

    // TODO 오브젝트나 배열 타입인 경우 deepCompare 후에 변경 적용 여부를 결정한다.

    /* 빈 그리드로 시작한 경우, data 설정이 되어있지 않을 수 있다. */
    var beforeRecord = this.record
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

    this.record = afterRecord

    // if (beforeRecord) {
    //   records.splice(row, 1, afterRecord)
    // } else {
    //   records.push(afterRecord)
    // }

    // this.data = {
    //   ...this.data,
    //   records: [...records]
    // }

    // this.dispatchEvent(
    //   new CustomEvent('record-change', {
    //     bubbles: true,
    //     composed: true,
    //     detail: {
    //       before: beforeRecord,
    //       after: afterRecord,
    //       column,
    //       row
    //     }
    //   })
    // )
  }

  firstUpdated() {
    /* long-press */
    longpressable(this.shadowRoot.querySelector('[content]'))

    this.shadowRoot.querySelector('[content]').addEventListener('click', e => {
      var columns = this.config.columns

      openPopup(
        html`
          <record-form
            style=${STYLE}
            .columns=${columns}
            .record=${this.record}
            .rowIndex=${this.rowIndex}
            @field-change=${e => this.onFieldChange(e)}
          ></record-form>
        `,
        {
          backdrop: true
        }
      )
    })

    this.shadowRoot.addEventListener('long-press', e => {
      var columns = this.config.columns

      openPopup(
        html`
          <record-view
            style=${STYLE}
            .columns=${columns}
            .record=${this.record}
            .rowIndex=${this.rowIndex}
            @field-change=${e => this.onFieldChange(e)}
          ></record-view>
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
