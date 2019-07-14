import { html, css } from 'lit-element'

import { PageView, store } from '@things-factory/shell'
import { localize, i18next } from '@things-factory/i18n-base'

import '../components/data-grid/data-grid'

class GridTest extends localize(i18next)(PageView) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: rows;
      }

      data-grid {
        flex: 1;
      }
    `
  }

  static get properties() {
    return {
      config: Object,
      columns: Array
    }
  }

  render() {
    return html`
      <data-grid
        .config=${this.config}
        .columns=${this.columns}
        .sorters=${this.sorters}
        .records=${this.records}
        .total=${this.total}
        .page=${this.page}
        .limit=${this.limit}
      ></data-grid>
    `
  }

  activated(active) {
    if (!active) {
      return
    }

    this.total = 12098
    this.page = 119
    this.limit = 100

    this.config = {
      gutters: [
        {
          name: 'sequence'
        },
        {
          name: 'row-selector'
        },
        {
          name: 'button',
          icon: 'edit'
        }
      ]
    }

    this.columns = [
      {
        type: 'string',
        name: 'id',
        hidden: true
      },
      {
        type: 'string',
        name: 'name',
        header: i18next.t('field.name'),
        record: {
          align: 'center'
        },
        sortable: true,
        width: 120
      },
      {
        type: 'string',
        name: 'description',
        header: i18next.t('field.description'),
        record: {
          align: 'left'
        },
        width: 200
      },
      {
        type: 'string',
        name: 'email',
        header: i18next.t('field.email'),
        record: {
          align: 'left'
        },
        sortable: true,
        width: 130
      }
    ]

    this.sorters = [
      {
        name: 'name',
        descending: true
      },
      {
        name: 'email'
      }
    ]

    this.records = Array(200)
      .fill()
      .map((item, idx) => {
        return {
          id: idx,
          name: idx % 2 ? 'shnam' : 'heartyoh',
          description: idx % 2 ? 'hatiolab manager' : 'hatiosea manager',
          email: idx % 2 ? 'shnam@gmail.com' : 'heartyoh@gmail.com'
        }
      })
  }
}

window.customElements.define('grid-test', GridTest)
