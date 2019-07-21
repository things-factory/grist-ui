import { LitElement, html, css } from 'lit-element'

import { buildConfig } from './configure/config-builder'

import './data-grid/data-grid'
import './data-list/data-list'

export class DataGlister extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
      }

      data-grid,
      data-list {
        flex: 1;
        overflow-y: auto;
      }
    `
  }

  static get properties() {
    return {
      mode: String,
      config: Object,
      data: Object,
      _config: Object
    }
  }

  render() {
    return html`
      ${this.mode == 'GRID'
        ? html`
            <data-grid id="grist" .config=${this._config} .data=${this.data}> </data-grid>
          `
        : html`
            <data-list id="grist" .config=${this._config} .data=${this.data}> </data-list>
          `}
    `
  }

  updated(changes) {
    if (changes.has('config')) {
      this._config = buildConfig(this.config)
    }
  }

  get grist() {
    return this.shadowRoot.querySelector('#grist')
  }

  get selectedRecords() {
    var grist = this.grist
    return grist && grist.selectedRecords
  }

  set selectedRecords(selectedRecords) {
    var grist = this.grist
    if (grist) {
      grist.selectedRecords = selectedRecords
    }
  }
}

customElements.define('data-grist', DataGlister)
