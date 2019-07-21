import { html } from 'lit-element'

export class GutterRowSelector {
  static instance(config = {}) {
    return {
      type: 'gutter',
      name: 'row-selector',
      width: 26,
      resizable: false,
      sortable: false,
      header: {
        renderer: function(column) {
          return html`
            <input type="checkbox" />
          `
        }
      },
      record: {
        renderer: function(column, record, idx) {
          return html`
            <input type="checkbox" />
          `
        },
        align: 'center'
      }
    }
  }
}
