import { html, css } from 'lit-element'

import { PageView, isMobileDevice, sleep } from '@things-factory/shell'
import { localize, i18next } from '@things-factory/i18n-base'

import '../components/data-grist'

class GlisterTest extends localize(i18next)(PageView) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: rows;
      }

      data-grist {
        flex: 1;
      }
    `
  }

  static get properties() {
    return {
      config: Object,
      data: Object
    }
  }

  render() {
    return html`
      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.config}
        .data=${this.data}
        @page-changed=${e => {
          this.page = e.detail
          this.buildData()
        }}
        @limit-changed=${e => {
          this.limit = e.detail
          this.buildData()
        }}
      ></data-grist>
    `
  }

  async buildData() {
    await sleep(1000)

    var page = this.page
    var limit = this.limit
    var total = 120993
    var start = (page - 1) * limit

    this.data = {
      total,
      page,
      limit,
      records: Array(limit * page > total ? total % limit : limit)
        .fill()
        .map((item, idx) => {
          return {
            id: idx,
            name: idx % 2 ? `shnam-${start + idx + 1}` : `heartyoh-${start + idx + 1}`,
            description: idx % 2 ? 'hatiolab manager' : 'hatiosea manager',
            email: idx % 2 ? 'shnam@gmail.com' : 'heartyoh@gmail.com'
          }
        })
    }
  }

  activated(active) {
    if (!active) {
      return
    }

    this.config = {
      columns: [
        {
          type: 'gutter',
          name: 'sequence'
        },
        {
          type: 'gutter',
          name: 'row-selector'
        },
        {
          type: 'gutter',
          name: 'button',
          icon: 'edit'
        },
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
      ],
      sorters: [
        {
          name: 'name',
          descending: true
        },
        {
          name: 'email'
        }
      ],
      pagination: {
        pages: [20, 30, 50, 100, 200]
      }
    }

    this.page = 1
    this.limit = 10

    this.buildData(1)
  }
}

window.customElements.define('grist-test', GlisterTest)
