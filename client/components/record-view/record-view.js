import { LitElement, html, css } from 'lit-element'

import '../data-grid/data-grid-field'

export class RecordView extends LitElement {
  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-auto-rows: min-content;
        grid-gap: 10px 0;
        background-color: var(--record-view-background-color);
        padding: 10px;
      }

      label {
        position: relative;

        padding: var(--record-view-item-padding);
        border-bottom: var(--record-view-border-bottom);
        font: var(--record-view-label-font);
        color: var(--record-view-label-color);
      }

      label[editable]::after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;

        width: 0px;
        height: 0px;
        border-top: 7px solid red;
        border-left: 7px solid transparent;
      }

      data-grid-field {
        padding: var(--record-view-item-padding);
        border-bottom: var(--record-view-border-bottom);
        color: var(--record-view-color);
        background-color: transparent;
      }

      :first-child + data-grid-field {
        color: var(--record-view-focus-color);
        font-weight: bold;
      }
    `
  }

  static get properties() {
    return {
      columns: Array,
      record: Object,
      rowIndex: Number
    }
  }

  render() {
    var columns = (this.columns || []).filter(column => !column.hidden && column.type != 'gutter')
    var record = this.record || {}
    var rowIndex = this.rowIndex

    return html`
      ${columns.map(column => {
        let { editable } = column.record
        let dirtyFields = record['__dirtyfields__'] || {}
        let editing = false

        return html`
          <label ?editable=${editable}>${this._renderLabel(column)}</label>
          <data-grid-field
            .rowIndex=${rowIndex}
            .column=${column}
            .record=${record}
            ?editing=${editing}
            .value=${record[column.name]}
            ?dirty=${!!dirtyFields[column.name]}
          ></data-grid-field>
        `
      })}
    `
  }

  _renderLabel(column) {
    var { renderer } = column.header
    var title = renderer.call(this, column)

    return html`
      ${title}
    `
  }
}

customElements.define('record-view', RecordView)
