import { LitElement, html, css } from 'lit-element'

// TODO 로케일 설정에 따라서 포맷이 바뀌도록 해야한다.
const OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false
  // timeZone: 'America/Los_Angeles'
}

const formatter = new Intl.DateTimeFormat(navigator.language, OPTIONS)

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
          background-color: var(--data-list-background-color);
          overflow: auto;
        }

        .item {
          padding: var(--data-list-item-padding);
          border-bottom: var(--data-list-item-border-bottom);
        }
        .item:nth-child(even) {
          background-color: #fff;
        }
        .item div {
          padding-top: 3px;
        }

        .name {
          font: var(--data-list-item-name-font);
          color: var(--data-list-item-name-color);
          text-transform: capitalize;
        }

        .desc {
          font: var(--data-list-item-disc-font);
          color: var(--data-list-item-disc-color);
        }

        .update-info {
          font: var(--data-list-item-etc-font);
          color: var(--data-list-item-etc-color);
        }
        .update-info mwc-icon {
          vertical-align: middle;
          font-size: 1em;
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
                  <div class="update-info">
                    <mwc-icon>access_time</mwc-icon> Updated At :
                    ${formatter.format(new Date(Number(record.updatedAt)))} / ${record.updaterId}
                  </div>
                `
              : ``}
          </div>
        `
      )}
    `
  }
}

customElements.define('data-list', DataList)
