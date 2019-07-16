import { LitElement, html, css } from 'lit-element'

export class ListRenderer extends LitElement {
  static get properties() {
    return {
      value: String
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin: 0;
      }

      select {
        width: 100%;
        height: 100%;
      }
    `
  }

  render() {
    return html`
      <select>
        <option value="Whatever">One</option>
        <option value="Other" selected>Two</option>
      </select>
    `
  }
}

customElements.define('list-renderer', ListRenderer)
