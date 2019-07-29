import { LitElement, html, css } from 'lit-element'

const STYLE = css`
  :host {
    width: 100%;
    height: 100%;

    border: 0;
    background-color: transparent;
  }

  :host > * {
    width: 100%;
    height: 100%;

    border: 0;
    background-color: transparent;

    box-sizing: border-box;

    text-align: inherit;
    font-size: inherit;
    font-family: inherit;
  }

  :host > input[type='checkbox'] {
    width: initial;
  }
`

export class InputEditor extends LitElement {
  static get properties() {
    return {
      value: Object,
      column: Object,
      record: Object,
      row: Number
    }
  }

  static get styles() {
    return STYLE
  }

  render() {
    return this.editorTemplate
  }

  get editor() {
    return this.shadowRoot.firstElementChild
  }

  async firstUpdated() {
    this.shadowRoot.addEventListener('change', this.onchange.bind(this))
    this.shadowRoot.addEventListener('focusout', this.onfocusout.bind(this))
    this.shadowRoot.addEventListener('click', this.onclick.bind(this))
    this.shadowRoot.addEventListener('dblclick', this.ondblclick.bind(this))

    this.value = this._dirtyValue = this.formatForEditor(this.record[this.column.name])

    this.focus()
    await this.updateComplete
    this.select()
  }

  select() {
    this.editor.select && this.editor.select()
  }

  focus() {
    this.editor.focus()
  }

  formatForEditor(value) {
    return value === undefined ? '' : value
  }

  formatFromEditor(e) {
    return e.target.value
  }

  rebuildRecord(record, column, value) {
    return Object.assign(
      {
        __dirty__: 'M'
      },
      record,
      {
        [column.name]: value
      }
    )
  }

  onfocusout() {
    if (this._dirtyValue !== this.value) {
      this.dispatchEvent(
        new CustomEvent('record-change', {
          bubbles: true,
          composed: true,
          detail: {
            before: this.record,
            after: this.rebuildRecord(this.record, this.column, this._dirtyValue),
            row: this.row,
            column: this.column
          }
        })
      )
    }
  }

  onchange(e) {
    e.stopPropagation()

    this._dirtyValue = this.formatFromEditor(e)
  }

  onclick(e) {
    e.stopPropagation()
  }

  ondblclick(e) {
    e.stopPropagation()
  }

  get editorTemplate() {
    return html``
  }
}

customElements.define('input-editor', InputEditor)

export class TextInput extends InputEditor {
  get editorTemplate() {
    return html`
      <input type="text" .value=${this.value} />
    `
  }
}
customElements.define('text-input', TextInput)

export class NumberInput extends InputEditor {
  touchValue(e) {
    let value = e.target.value

    switch (this.column.type) {
      case 'float':
        return Number.parseFloat(value)
      case 'integer':
        return Number.parseInt(value)
      default:
        return Number(value)
    }
  }

  get editorTemplate() {
    return html`
      <input type="number" .value=${this.value} />
    `
  }
}
customElements.define('number-input', NumberInput)

export class DateInput extends InputEditor {
  get editorTemplate() {
    return html`
      <input type="date" .value=${this.value} />
    `
  }
}
customElements.define('date-input', DateInput)

export class TimeInput extends InputEditor {
  get editorTemplate() {
    return html`
      <input type="time" .value=${this.value} />
    `
  }
}
customElements.define('time-input', TimeInput)

export class DateTimeInput extends InputEditor {
  formatForEditor(timestamp) {
    if (!timestamp) {
      timestamp = Date.now()
    }
    var datetime = new Date(timestamp)

    var tzoffset = datetime.getTimezoneOffset() * 60000 //offset in milliseconds

    return new Date(timestamp - tzoffset).toISOString().slice(0, -1)
  }

  formatFromEditor(e) {
    var value = e.target.value
    var datetime = new Date(value)

    return datetime.getTime()
  }

  get editorTemplate() {
    return html`
      <input type="datetime-local" .value=${this.value} />
    `
  }
}
customElements.define('datetime-input', DateTimeInput)

export class ColorInput extends InputEditor {
  get editorTemplate() {
    return html`
      <input type="color" .value=${this.value} />
    `
  }
}
customElements.define('color-input', ColorInput)

export class CheckboxInput extends InputEditor {
  formatFromEditor(e) {
    return e.target.checked
  }

  get editorTemplate() {
    return html`
      <input type="checkbox" .checked=${!!this.value} />
    `
  }
}
customElements.define('checkbox-input', CheckboxInput)

export class Select extends InputEditor {
  get editorTemplate() {
    var { options = [] } = this.column.record || {}
    options = options.map(option => {
      if (typeof option == 'string') {
        return {
          display: option,
          value: option
        }
      }
      return option
    })

    return html`
      <select>
        ${options.map(
          option => html`
            <option ?selected=${option.value == this.value}>${option.display}</option>
          `
        )}
      </select>
    `
  }
}
customElements.define('select-input', Select)
