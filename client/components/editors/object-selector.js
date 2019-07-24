import { i18next } from '@things-factory/i18n-base'
import { client, isMobileDevice } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'
import '../data-grist'

export class ObjectSelector extends LitElement {
  static get properties() {
    return {
      value: String,
      config: Object,
      data: Object,
      queryName: String,
      confirmCallback: Object,
      selectedRecords: Array
    }
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        overflow-x: overlay;

        padding: 5px;

        background-color: #fff;
      }

      form {
        position: relative;
      }

      .grist {
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      data-grist {
        overflow-y: hidden;
        flex: 1;
      }

      .button-container {
        display: flex;
        margin-left: auto;
      }

      [search] {
        position: absolute;
        right: 0;
      }
    `
  }

  get context() {
    return {
      title: i18next.t('title.confirm_arrival_notice')
    }
  }

  render() {
    return html`
      <form>
        <input name="name" />
        <input name="description" />

        <mwc-icon search>search</mwc-icon>
      </form>

      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.config}
        .data=${this.data}
        .selectedRecords=${this.selectedRecords}
      ></data-grist>

      <div class="button-container">
        <mwc-button @click=${this.oncancel.bind(this)}>${i18next.t('button.cancel')}</mwc-button>
        <mwc-button @click=${this.onconfirm.bind(this)}>${i18next.t('button.confirm')}</mwc-button>
      </div>
    `
  }

  oncancel(e) {
    history.back()
  }

  onconfirm(e) {
    this.confirmCallback && this.confirmCallback(this.selected)
    history.back()
  }

  async firstUpdated() {
    this.config = {
      columns: [
        {
          type: 'gutter',
          name: 'sequence'
        },
        {
          type: 'gutter',
          name: 'row-selector',
          multiple: false
        },
        {
          type: 'string',
          name: 'id',
          header: i18next.t('field.id'),
          hidden: true
        },
        {
          type: 'string',
          name: 'name',
          header: i18next.t('field.name'),
          record: {
            align: 'left'
          },
          sortable: true,
          width: 160
        },
        {
          type: 'string',
          name: 'description',
          header: i18next.t('field.description'),
          record: {
            align: 'left'
          },
          sortable: true,
          width: 300
        }
      ],
      pagination: {
        infinite: true
      }
    }

    const response = await client.query({
      query: gql`
        query {
          ${this.queryName} (filters: []) {
            items {
              id
              name
              description
            }
            total
          }
        }
      `
    })

    this.data = {
      records: response.data[this.queryName].items,
      total: response.data[this.queryName].total,
      limit: 100,
      page: 1
    }

    var selected = this.data.records.find(item => this.value == item.id)
    if (selected) {
      this.selectedRecords = [selected]
    }
  }

  get selected() {
    var grist = this.shadowRoot.querySelector('data-grist')

    var selectedRecords = grist.selectedRecords

    return selectedRecords && selectedRecords.length > 0 ? selectedRecords[0] : undefined
  }
}

customElements.define('object-selector', ObjectSelector)
