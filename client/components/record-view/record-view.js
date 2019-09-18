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
      [header] {
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: var(--record-view-header-height);
        background-color: var(--record-view-header-background);
        color: var(--record-view-header-color);
      }
      [header] h1 {
        flex-wrap: nowrap;
        justify-content: center;
        text-align: center;
        flex: 1 1 0%;
        text-transform: capitalize;
        font: var(--record-view-header-font);
      }
      [footer] {
        text-align: right;
        background-color: var(--record-view-footer-background);
        box-shadow: var(--context-toolbar-shadow-line);
        height: var(--record-view-footer-height);
      }
      [footer] button {
        background-color: transparent;
        border: none;
        height: var(--record-view-footer-button-height);
        padding: var(--record-view-footer-button-padding);
        color: var(--record-view-footer-button-color);
        text-transform: capitalize;
      }
      [footer] button mwc-icon {
        vertical-align: middle;
        margin: auto;
        width: var(--record-view-footer-iconbutton-size);
        margin-bottom: var(--record-view-footer-iconbutton-margin);
        display: var(--record-view-footer-iconbutton-display);
        font-size: var(--record-view-footer-iconbutton-size);
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
      <div header>
        <mwc-icon>arrow_back</mwc-icon>
        <h1>grist view</h1>
      </div>
      <record-view-body .columns=${this.columns} .record=${this.record} .rowIndex=${this.rowIndex}> </record-view-body>
      <div footer>
        <button><mwc-icon>clear</mwc-icon>reset</button>
        <button><mwc-icon>done_all</mwc-icon>submit</button>
      </div>
    `
  }
}

customElements.define('record-view', RecordView)
