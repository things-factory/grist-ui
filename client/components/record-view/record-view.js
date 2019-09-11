import { LitElement, html, css } from 'lit-element'

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
        padding: var(--record-view-item-padding);
        border-bottom: var(--record-view-border-bottom);
        font: var(--record-view-label-font);
        color: var(--record-view-label-color);
      }
      div {
        padding: var(--record-view-item-padding);
        border-bottom: var(--record-view-border-bottom);
        color: var(--record-view-color);
        text-align: right;
      }
      :first-child + div {
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
        return html`
          <label>${this._renderLabel(column)}</label>
          <div>${column.record.renderer.call(this, record[column.name], column, record, rowIndex)}</div>
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
