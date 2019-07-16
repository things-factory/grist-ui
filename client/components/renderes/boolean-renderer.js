import { LitElement, html, css } from 'lit-element'

export class BooleanRenderer extends LitElement {
  static get properties() {
    return {
      value: Boolean
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        text-align: center;
      }
    `
  }

  render() {
    return html`
      <input type="checkbox" .checked=${this.value} disabled />
    `
  }
}

customElements.define('boolean-renderer', BooleanRenderer)
