import { html } from 'lit-element'
import '@material/mwc-icon'

export class GutterButton {
  static instance(config = {}) {
    var { icon = 'edit' } = config

    var inlineHeaderStyle = 'font-size: var(--grid-header-fontsize, 13px);vertical-align: middle;'
    var inlineRecordStyle = 'font-size: var(--grid-record-fontsize, 13px);vertical-align: middle;'

    return Object.assign({}, config, {
      type: 'gutter',
      gutterType: 'button',
      width: 26,
      resizable: false,
      sortable: false,
      header: {
        renderer: function(column) {
          return html`
            <mwc-icon style=${inlineHeaderStyle}>${icon}</mwc-icon>
          `
        }
      },
      record: {
        renderer: function(value, column, record, rowIndex, field) {
          return html`
            <mwc-icon style=${inlineRecordStyle} center>${icon}</mwc-icon>
          `
        },
        align: 'center'
      }
    })
  }
}
