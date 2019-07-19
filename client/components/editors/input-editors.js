import { LitElement, html, css } from 'lit-element'
import { registerEditor } from './registry'

class InputEditor extends LitElement {
  static get properties() {
    return {
      value: { attribute: true },
      column: Object,
      record: Object,
      row: Number
    }
  }

  static get styles() {
    css`
      :host {
        width: 100%;
        height: 100%;

        border: 0;
        background-color: transparent;
      }
    `
  }

  render() {
    return this.template
  }

  firstupdated() {
    this.addEventListener('change', this.onchange.bind(this))
  }

  extractValue(e) {
    return value
  }

  touchRecord(value) {
    return Object.assign({}, this.record, {
      [this.column.name]: value
    })
  }

  onchange(e) {
    e.stopPropagation()

    this.dispatchEvent(
      new CustomEvent('record-changed', {
        bubbles: true,
        composed: true,
        detail: {
          before: this.record,
          after: this.touchRecord(this.extractValue(e)),
          row: this.row,
          column: this.column
        }
      })
    )
  }

  get template() {
    return html``
  }
}

class TextInput extends InputEditor {
  get template() {
    return html`
      <input type="text" .value=${this.value} />
    `
  }
}
registerEditor('integer', TextInput)

class NumberInput extends InputEditor {
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

  get template() {
    return html`
      <input type="number" .value=${this.value} />
    `
  }
}
registerEditor('integer', NumberInput)
registerEditor('float', NumberInput)

class CheckboxInput extends InputEditor {
  extractValue(e) {
    return e.target.checked
  }

  get template() {
    return html`
      <input type="checkbox" .checked=${!!this.value} />
    `
  }
}
registerEditor('boolean', CheckboxInput)

class Select extends InputEditor {
  get template() {
    var { options = [] } = this.column.editor || {}
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
            <option value="Whatever" ?selected=${option.value == this.value}>${option.display}</option>
          `
        )}
      </select>
    `
  }
}
registerEditor('select', Select)
