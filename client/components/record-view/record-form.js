import { LitElement, html, css } from 'lit-element'

export class RecordForm extends LitElement {
  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: 1fr 2fr;
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
        let { editable, renderer, editor } = column.record
        return html`
          <label>${this._renderLabel(column)}</label>
          <div>
            ${editable
              ? editor.call(this.field, column, record, rowIndex)
              : renderer.call(this.field, column, record, rowIndex)}
          </div>
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

customElements.define('record-form', RecordForm)
