import { LitElement, html, css } from 'lit-element'

class DataList extends LitElement {
  static get properties() {
    return {
      config: Object,
      data: Object,
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

  firstUpdated() {
    /* infinite scrolling */
    this.addEventListener('scroll', e => {
      const totalScrollHeight = this.scrollHeight
      const screenHeight = this.offsetHeight
      const currentScrollTop = this.scrollTop

      if (totalScrollHeight == screenHeight + currentScrollTop) {
        /* 마지막 페이지까지 계속 페이지를 증가시킨다. */
        var lastPage = Math.ceil(this._total / this._limit)

        if (this.page < lastPage) {
          this.dispatchEvent(new CustomEvent('page-changed', { bubbles: true, composed: true, detail: this.page + 1 }))
        }
      }
    })
  }

  updated(changes) {
    if (changes.has('config')) {
      this._records = []
      this.page = 0
    }

    if (changes.has('data')) {
      this._records = (this._records || []).concat((this.data && this.data.records) || [])
      this._total = this.data.total
      this._limit = this.data.limit
      this.page = this.data.page
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
