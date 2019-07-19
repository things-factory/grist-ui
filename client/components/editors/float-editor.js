import { LitElement, html, css } from 'lit-element'
import { registerEditor } from './registry'

class FloatEditor extends LitElement {
  static get properties() {
    return {
      value: String
    }
  }

  static get styles() {
    css`
      :host {
        border: 0;
        margin: 0;
      }
    `
  }

  render() {
    return html`
      <input type="text" .value=${this.value} />
    `
  }
}

registerEditor('float', FloatEditor)
