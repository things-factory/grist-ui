import { LitElement, html, css } from 'lit-element'

class DataList extends LitElement {
  static get properties() {
    return {
      config: Object,
      data: Object,
      page: Number,
      _records: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          overflow: auto;
        }

        .item {
          padding: 5px 15px 5px 15px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .name {
          font-size: 1.2em;
          font-weight: bold;
        }

        .desc {
          font-size: 0.8em;
          color: gray;
        }

        .update-info {
          font-size: 0.8em;
          color: black;
        }
      `
    ]
  }

  updated(changes) {
    if (changes.has('config')) {
      this._records = []
    }

    if (changes.has('data')) {
      this._records = (this._records || []).concat((this.data && this.data.records) || [])
      this._total = this.data.total
    }
  }

  render() {
    return html`
      ${(this._records || []).map(
        record => html`
          <div class="item">
            <div class="name">${record.name}</div>
            <div class="desc">${record.description}</div>
            ${record.updatedAt
              ? html`
                  <div class="update-info">Updated At : ${record.updatedAt} / ${record.updaterId}</div>
                `
              : ``}
          </div>
        `
      )}
    `
  }
}

customElements.define('data-list', DataList)
