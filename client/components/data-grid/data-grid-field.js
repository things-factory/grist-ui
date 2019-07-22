import { LitElement, html, css } from 'lit-element'

const DEFAULT_TEXT_ALIGN = 'left'

class DataGridField extends LitElement {
  static get properties() {
    return {
      align: { attribute: true },
      record: Object,
      column: Object,
      rowIndex: Number,
      columnIndex: Number,
      data: Object,
      selectedRecords: Array,
      editing: { attribute: 'editing' }
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

        :host([editing]) {
          padding: 0;
        }

        :host > * {
          margin: 0 auto;
        }
      `
    ]
  }

  get isEditing() {
    return this.hasAttribute('editing')
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

    if (this.isEditing) {
      let { editor } = column.record

      let rendered = editor.call(this, column, record, rowIndex)
      rendered.id = 'editor'

      return html`
        ${rendered}
      `
    } else {
      let { renderer } = column.record
      let rendered = renderer.call(this, column, record, rowIndex)

      return html`
        ${rendered}
      `
    }
  }

  updated(changes) {
    if (changes.has('editing')) {
      if (this.isEditing) {
        this._onKeydownInEditingMode = (e => {
          if (e.keyCode == 27 /* KEY_ESC */) {
            /* 편집 취소 */
            this._editCancelled = true
          }
        }).bind(this)

        this._onRecordChange = (e => {
          console.log('record-change data-grid-field')
          this._editCancelled && e.stopPropagation()
        }).bind(this)

        delete this._editCancelled
        this.addEventListener('record-change', this._onRecordChange)
        this.addEventListener('keydown', this._onKeydownInEditingMode)
      } else {
        this.removeEventListener('record-change', this._onRecordChange)
        this.removeEventListener('keydown', this._onKeydownInEditingMode)
      }
    }
  }
}

customElements.define('data-grid-field', DataGridField)
