import { html } from 'lit-element'

export class GutterRowSelector {
  static instance(config = {}) {
    return Object.assign({}, config, {
      type: 'gutter',
      name: 'row-selector',
      width: 26,
      resizable: false,
      sortable: false,
      header: {
        renderer: function(column) {
          return html`
            <input
              type="checkbox"
              .checked=${(this.selectedRecords || []).length > 0}
              @change=${e => {
                let selected = column.multiple ? e.target.checked : false

                this.dispatchEvent(
                  new CustomEvent('select-all-change', {
                    bubbles: true,
                    composed: true,
                    detail: {
                      selected
                    }
                  })
                )

                e.stopPropagation()
              }}
            />
          `
        },
        handlers: {
          change: function(e) {}
        }
      },
      record: {
        renderer: function(column, record, idx) {
          return html`
            <input
              type=${column.multiple ? 'checkbox' : 'radio'}
              .checked=${this.hasAttribute('selected-row')}
              @change=${e => {
                let selected = e.target.checked

                let detail = column.multiple
                  ? {
                      added: selected ? [record] : [],
                      removed: selected ? [] : [record]
                    }
                  : {
                      records: selected ? [record] : []
                    }

                this.dispatchEvent(
                  new CustomEvent('select-record-change', {
                    bubbles: true,
                    composed: true,
                    detail
                  })
                )

                e.stopPropagation()
              }}
            />
          `
        },
        align: 'center',
        handlers: {
          change: function(e) {
            e.target.checked
          }
        }
      }
    })
  }
}
