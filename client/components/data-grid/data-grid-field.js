import { LitElement, html, css } from 'lit-element'

const DEFAULT_TEXT_ALIGN = 'left'

class DataGridField extends LitElement {
  static get properties() {
    return {
      align: String,
      row: { attribute: true },
      column: { attribute: true },
      odd: { attribute: true },
      focused: { attribute: true }
    }
  }

  static get styles() {
    return [
      css`
        :host {
          white-space: nowrap;
          overflow: hidden;
          background-color: var(--grid-record-background-color, white);
          padding: 7px 5px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);

          box-sizing: border-box;

          font-size: var(--grid-record-wide-fontsize);
          text-overflow: ellipsis;

          text-align: var(--data-grid-field-text-align, left);
        }

        :host([odd]) {
          background-color: var(--grid-record-odd-background-color, #eee);
        }

        :host([focused]) {
          border: 1px dotted rgba(0, 0, 0, 0.5);
        }

        :host > * {
          margin: 0 auto;
        }
      `
    ]
  }

  render() {
    this.style.setProperty('--data-grid-field-text-align', this.align || DEFAULT_TEXT_ALIGN)

    return html`
      <slot></slot>
    `
  }
}

customElements.define('data-grid-field', DataGridField)
