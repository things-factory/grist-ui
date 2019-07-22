import { html, css } from 'lit-element'

import { PageView, isMobileDevice, sleep } from '@things-factory/shell'
import { localize, i18next } from '@things-factory/i18n-base'

import '../components/data-grist'

class GristTest extends localize(i18next)(PageView) {
  static get styles() {
    return css`
      :host {
        display: block;

        width: 100%;
      }

      data-grist {
        width: 100%;
        height: 100%;
      }
    `
  }

  static get properties() {
    return {
      config: Object,
      data: Object
    }
  }

  get context() {
    return {
      title: 'Grist Test'
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
        @sorters-changed=${e => {
          this.sorters = e.detail
          this.buildData()
        }}
      ></data-grist>
    `
  }

  async buildData() {
    await sleep(1000)

    var page = this.page
    var limit = this.limit
    var sorters = this.sorters
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
            email: idx % 2 ? 'shnam@gmail.com' : 'heartyoh@gmail.com',
            active: idx % 2 ? true : false,
            company:
              idx % 2
                ? {
                    id: '2',
                    name: 'HatioLAB',
                    description: '경기도 성남시'
                  }
                : {
                    id: '3',
                    name: 'HatioSEA',
                    description: '말레이시아 세티아알람'
                  },
            role: idx % 2 ? 'admin' : 'worker',
            color: idx % 2 ? '#87f018' : '#180f87',
            rate: Math.round(Math.random() * 100),
            homepage: idx % 2 ? 'http://hatiolab.com' : 'http://deadpool.hatiolab.com',
            createdAt: Date.now(),
            updatedAt: Date.now()
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
          name: 'dirty'
        },
        {
          type: 'gutter',
          name: 'sequence'
        },
        {
          type: 'gutter',
          name: 'row-selector',
          multiple: true
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
          type: 'link',
          name: 'name',
          header: i18next.t('field.name'),
          record: {
            align: 'center',
            editable: true,
            options: {
              // href: 'http://hatiolab.com',
              href: function(column, record, rowIndex) {
                return record['homepage']
              }
              // target: '_blank'
            }
          },
          sortable: true,
          width: 120
        },
        {
          type: 'string',
          name: 'description',
          header: i18next.t('field.description'),
          record: {
            align: 'left',
            editable: true
          },
          width: 200
        },
        {
          type: 'string',
          name: 'email',
          header: i18next.t('field.email'),
          record: {
            align: 'left',
            editable: true
          },
          sortable: true,
          width: 130
        },
        {
          type: 'object',
          name: 'company',
          header: i18next.t('field.company'),
          record: {
            align: 'left',
            editable: true
          },
          sortable: true,
          width: 240
        },
        {
          type: 'boolean',
          name: 'active',
          header: i18next.t('field.active'),
          record: {
            align: 'center',
            editable: true
          },
          sortable: true,
          width: 60
        },
        {
          type: 'select',
          name: 'role',
          header: i18next.t('field.active'),
          record: {
            align: 'center',
            options: ['admin', 'worker', 'tester'],
            editable: true
          },
          sortable: true,
          width: 120
        },
        {
          type: 'color',
          name: 'color',
          header: i18next.t('field.color'),
          record: {
            align: 'center',
            editable: true
          },
          sortable: true,
          width: 50
        },
        {
          type: 'float',
          name: 'rate',
          header: i18next.t('field.rate'),
          record: {
            align: 'center',
            editable: true
          },
          sortable: true,
          width: 50
        },
        {
          type: 'progress',
          name: 'rate',
          header: i18next.t('field.rate'),
          record: {
            align: 'center',
            editor: 'float',
            editable: true
          },
          sortable: true,
          width: 50
        },
        {
          type: 'datetime',
          name: 'updatedAt',
          header: i18next.t('field.updated-at'),
          record: {
            align: 'center',
            editable: true
          },
          sortable: true,
          width: 180
        },
        {
          type: 'datetime',
          name: 'createdAt',
          header: i18next.t('field.created-at'),
          record: {
            align: 'center',
            editable: true
          },
          sortable: true,
          width: 180
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
    this.limit = 50

    this.buildData(1)
  }
}

window.customElements.define('grist-test', GristTest)
