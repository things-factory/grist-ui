import { html } from 'lit-html'
import '@material/mwc-icon'

const INLINESTYLE =
  'font-size: var(--grid-record-fontsize, 13px);vertical-align: middle; color: var(--grid-dirty-color, inherit)'

export class GutterDirty {
  static instance(config = {}) {
    return Object.assign({}, config, {
      type: 'gutter',
      name: 'dirty',
      width: 16,
      resizable: false,
      sortable: false,
      header: '',
      record: {
        renderer: function(column, record, idx) {
          switch (record['__dirty__']) {
            case '+':
              return html`
                <mwc-icon style=${INLINESTYLE}>add</mwc-icon>
              `
            case '-':
              return html`
                <mwc-icon style=${INLINESTYLE}>remove</mwc-icon>
              `
            case 'M':
              return html`
                <mwc-icon style=${INLINESTYLE}>done</mwc-icon>
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
