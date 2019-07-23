import { LitElement, html, css } from 'lit-element'

import { isMobileDevice } from '@things-factory/shell'
import { i18next } from '@things-factory/i18n-base'

import '../data-grist'

export class ObjectSelector extends LitElement {
  static get properties() {
    return {
      value: String,
      config: Object,
      data: Object,
      confirmCallback: Object
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

  firstUpdated() {
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

    this.data = {
      records: new Array(50).fill().map((item, idx) => {
        return {
          id: idx + 1,
          name: 'QWERTYUIOP',
          description: 'qwertyuioasdfghjklzxcvbnm'
        }
      })
    }

    var selected = this.data.records.find(item => this.value == item.id)
    if (selected) {
      this.selectedRecords = [selected]
    }
  }

  get selected() {
    var grist = this.shadowRoot.querySelector('data-grist')

    var selected = grist.selected

    return selected && selected.length > 0 ? selected[0] : undefined
  }
}

customElements.define('object-selector', ObjectSelector)
