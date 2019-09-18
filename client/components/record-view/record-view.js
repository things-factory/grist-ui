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
      <div header>header</div>
      <record-view-body .columns=${this.columns} .record=${this.record} .rowIndex=${this.rowIndex}> </record-view-body>
      <div footer>footer</div>
    `
  }
}

customElements.define('record-view', RecordView)
