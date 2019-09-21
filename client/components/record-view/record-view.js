import { LitElement, html, css } from 'lit-element'

import './record-view-body'

export class RecordView extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }

      record-view-body {
        flex: 1;
      }

      [footer] {
        display: flex;
        text-align: right;
        background-color: var(--record-view-footer-background);
        box-shadow: var(--context-toolbar-shadow-line);
        height: var(--record-view-footer-height);
      }

      [footer] button {
        flex: 1;
        background-color: transparent;
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-width: 0 0 0 1px;
        height: var(--record-view-footer-button-height);
        color: var(--record-view-footer-button-color);
        font-size: 17px;
        line-height: 3;
      }

      [footer] button * {
        vertical-align: middle;
      }

      [footer] button mwc-icon {
        margin-top: -3px;
        margin-right: 5px;
        font-size: var(--record-view-footer-iconbutton-size);
      }

      [footer] button[ok] {
        background-color: var(--record-view-footer-focus-background);
      }
    `
  }

  static get properties() {
    return {
      columns: Array,
      record: Object,
      rowIndex: Number
    }
  }

  render() {
    return html`
      <record-view-body .columns=${this.columns} .record=${this.record} .rowIndex=${this.rowIndex}> </record-view-body>
      <div footer>
        <button><mwc-icon>refresh</mwc-icon>Reset</button>
        <button><mwc-icon>clear</mwc-icon>Cancel</button>
        <button ok><mwc-icon>radio_button_unchecked</mwc-icon>OK</button>
      </div>
    `
  }
}

customElements.define('record-view', RecordView)
