import { html } from 'lit-html'
import '@material/mwc-icon'

const INLINESTYLE =
  'font-size: var(--grid-record-fontsize, 13px);vertical-align: middle; color: var(--grid-dirty-color, inherit)'

export class GutterDirty {
  static instance(config = {}) {
    return Object.assign({}, config, {
      type: 'gutter',
      name: '__dirty__',
      gutterType: 'dirty',
      width: 16,
      resizable: false,
      sortable: false,
      header: '',
      record: {
        renderer: function(value, column, record, rowIndex, field) {
          switch (value) {
            case '+':
              return html`
                <mwc-icon style=${INLINESTYLE} center>add</mwc-icon>
              `
            case '-':
              return html`
                <mwc-icon style=${INLINESTYLE} center>remove</mwc-icon>
              `
            case 'M':
              return html`
                <mwc-icon style=${INLINESTYLE} center>done</mwc-icon>
              `
            default:
              return ''
          }
        },
        align: 'center'
      }
    })
  }
}
