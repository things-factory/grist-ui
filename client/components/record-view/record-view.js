import { LitElement, html, css } from 'lit-element'

export class RecordView extends LitElement {
  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-auto-rows: min-content;
        grid-gap: 10px;
        background-color: #fff;
        padding: 10px;
      }

      label {
        text-align: right;
      }
    `
  }

  static get properties() {
    return {
      field: Object,
      columns: Array,
      column: Object,
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
          <div>${column.record.renderer.call(this.field, column, record, rowIndex)}</div>
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
