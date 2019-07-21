import { LitElement, html, css } from 'lit-element'

import { getRenderer } from '../renderers'
import { getEditor } from '../editors'

const DEFAULT_TEXT_ALIGN = 'left'

class DataGridField extends LitElement {
  static get properties() {
    return {
      align: { attribute: true },
      odd: { attribute: true },
      record: Object,
      column: Object,
      rowIndex: Number,
      columnIndex: Number,
      editing: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;

          white-space: nowrap;
          overflow: hidden;
          background-color: var(--grid-record-background-color, white);
          padding: 7px 0px;
          border: 1px solid transparent;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);

          font-size: var(--grid-record-wide-fontsize);
          text-overflow: ellipsis;

          text-align: var(--data-grid-field-text-align, left);
        }

        :host([edit]) {
          padding: 0;
        }

        :host > * {
          margin: 0 auto;
        }
      `
    ]
  }

  render() {
    if (!this.column) {
      return html``
    }

    var align = (this.column.record && this.column.record.align) || DEFAULT_TEXT_ALIGN
    if (align != DEFAULT_TEXT_ALIGN) {
      this.style.setProperty('--data-grid-field-text-align', align)
    }

    var column = this.column
    var record = this.record
    var rowIndex = this.rowIndex

    var value = this.record[column.name]

    if (this.editing) {
      var { editor } = column.record

      if (typeof editor == 'function') {
        value = editor.call(this, column, rowIndex)
      } else {
        value = getEditor(column, record, rowIndex)
        value.id = 'editor'
      }
    } else {
      var { renderer } = column.record
      value = renderer.call(this, column, record, rowIndex)
    }

    return html`
      ${value}
    `
  }

  async updated(changed) {
    if (changed.has('editing')) {
      if (this.editing) {
        this.setAttribute('edit', '')

        await this.updateComplete

        let editor = this.shadowRoot.querySelector('#editor').editor

        editor.focus()
        editor.select && editor.select()
      } else {
        this.removeAttribute('edit')
      }
    }
  }

  firstUpdated() {
    this.addEventListener('click', async e => {
      let { rowIndex: row, columnIndex: column } = this

      this.dispatchEvent(
        new CustomEvent('cell-click', {
          bubbles: true,
          composed: true,
          detail: { row, column }
        })
      )

      e.stopPropagation()
    })

    this.addEventListener('dblclick', async e => {
      let { rowIndex: row, columnIndex: column } = this

      this.dispatchEvent(
        new CustomEvent('cell-dblclick', {
          bubbles: true,
          composed: true,
          detail: { row, column }
        })
      )

      e.stopPropagation()
    })
  }
}

customElements.define('data-grid-field', DataGridField)
