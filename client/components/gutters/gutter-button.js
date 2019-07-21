import { html } from 'lit-element'
import '@material/mwc-icon'

import { openPopup } from '@things-factory/layout-base'

function open() {
  openPopup(
    html`
      <button value="이름..." @click=${e => open2()}>NAME</button>
    `,
    {
      backdrop: false
    }
  )
}

function open2() {
  openPopup(
    html`
      <input type="text" value="hahaha" />
    `,
    {
      backdrop: true
    }
  )
}

export class GutterButton {
  static instance(config = {}) {
    var { icon = 'edit' } = config
    var inlineStyle = 'font-size: var(--grid-header-fontsize, 13px);vertical-align: middle;'

    return {
      type: 'gutter',
      name: 'button',
      width: 26,
      resizable: false,
      sortable: false,
      header: {
        renderer: function(column) {
          return html`
            <mwc-icon style=${inlineStyle}>${icon}</mwc-icon>
          `
        }
      },
      record: {
        renderer: function(column, record, idx) {
          return html`
            <mwc-icon style=${inlineStyle} @click=${open}>${icon}</mwc-icon>
          `
        },
        align: 'center'
      }
    }
  }
}
