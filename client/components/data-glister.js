import { LitElement, html, css } from 'lit-element'

import './data-grid/data-grid'
import './data-list/data-list'

// const GRID_GUTTERS = [
//   {
//     type: 'gutter',
//     name: 'sequence'
//   },
//   {
//     type: 'gutter',
//     name: 'row-selector'
//   },
//   {
//     type: 'gutter',
//     name: 'button',
//     icon: 'edit'
//   }
// ]

// const LIST_GUTTERS = [
//   {
//     type: 'gutter',
//     name: 'row-selector'
//   }
// ]

const PAGINATION = {
  pages: [20, 30, 50, 100, 200]
}

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
      page: Number
    }
  }

  render() {
    return html`
      ${this.mode == 'GRID'
        ? html`
            <data-grid .config=${this.config} .data=${this.data}> </data-grid>
          `
        : html`
            <data-list .config=${this.config} .data=${this.data}> </data-list>
          `}
    `
  }
}

customElements.define('data-glister', DataGlister)
