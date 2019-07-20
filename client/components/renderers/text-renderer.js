import { LitElement, html, css } from 'lit-element'

export class TextRenderer extends LitElement {
  static get properties() {
    return {
      value: String
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;

        width: 100%;
        height: 100%;
        background-color: transparent;
        overflow: hidden;

        box-sizing: border-box;

        text-align: inherit;
        font-size: inherit;
        font-family: inherit;

        text-overflow: ellipsis;
      }
    `
  }

  render() {
    return html`
      ${this.value}
    `
  }

  format(value) {
    var { options } = this.column.renderer || {}
    if (!options) {
      return value
    }

    var { format } = options
    // TODO format here...
    return value
  }
}

customElements.define('text-renderer', TextRenderer)
