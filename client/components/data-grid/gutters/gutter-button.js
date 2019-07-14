import { html } from 'lit-element'

import '@material/mwc-icon'

export class GutterButton {
  static instance(config = {}) {
    var { icon = 'edit' } = config
    var inlineStyle = 'font-size: var(--grid-header-fontsize, 13px);vertical-align: middle;'

    return {
      type: 'gutter',
      name: 'button',
      width: 26,
      sortable: false,
      header: {
        renderer: function(column) {
          return html`
            <mwc-icon style=${inlineStyle}>${icon}</mwc-icon>
          `
        }
      },
      record: {
        renderer: function(column, idx) {
          return html`
            <mwc-icon style=${inlineStyle}>${icon}</mwc-icon>
          `
        },
        align: 'center'
      }
    }
  }
}
