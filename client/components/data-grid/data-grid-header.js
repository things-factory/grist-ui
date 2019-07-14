import { LitElement, html, css } from 'lit-element'

class DataGridHeader extends LitElement {
  constructor() {
    super()

    this.columns = []
    this.gutters = []
  }

  static get properties() {
    return {
      gutters: Array,
      columns: Array,
      sorters: Array,
      records: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          grid-template-columns: var(--grid-template-columns);

          overflow: hidden;
        }

        div {
          display: flex;

          white-space: nowrap;
          overflow: hidden;
          background-color: var(--grid-header-background-color, gray);
          border: 1px solid var(--grid-header-border-color);
          border-width: 1px 0;
          border-left: 1px solid rgba(255, 255, 255, 0.6);
          border-right: 1px solid rgba(0, 0, 0, 0.1);
          padding: 5px 0;

          text-overflow: ellipsis;
          text-align: center;
          font-size: var(--grid-header-fontsize, 1em);
          color: var(--grid-header-color, white);
        }

        span {
          white-space: nowrap;
          overflow: hidden;

          text-align: center;
        }

        span[title] {
          flex: 1;
          text-overflow: ellipsis;
          font-size: var(--grid-header-fontsize);
          color: var(--grid-header-color, white);
        }

        span[sorter] {
          padding: 0;
          border: 0;
          font-size: 10px;
        }

        span[splitter] {
          cursor: col-resize;
        }
      `
    ]
  }

  _onWheelEvent(e) {
    var delta = Math.max(-1, Math.min(1, e.deltaY || 0))
    this.scrollLeft = Math.max(0, this.scrollLeft - delta * 40)

    e.preventDefault()
  }

  firstUpdated() {
    this.addEventListener('wheel', this._onWheelEvent.bind(this), false)
  }

  render() {
    var sorters = this.sorters
    var columns = this.columns.filter(column => !column.hidden)
    var gutters = (this.gutters || []).filter(gutter => !gutter.hidden)

    return html`
      ${gutters.map(
        (gutter, idx) =>
          html`
            <div>
              <span title @click=${gutter.handler}>${this._renderHeader(gutter)} </span>
            </div>
          `
      )}
      ${columns.map(
        (column, idx) =>
          html`
            <div>
              <span title @click=${e => this._changeSort(column)}>${this._renderHeader(column)} </span>

              <span sorter @click=${e => this._changeSort(column)}>
                ${this._renderSortHeader(column, sorters)}
              </span>

              <span splitter draggable="true" @dragstart=${e => this._dragStart(e, idx)}>&nbsp;</span>
            </div>
          `
      )}

      <div></div>
    `
  }

  _renderHeader(column) {
    var { header } = column
    var title

    if (typeof header == 'object') {
      let { renderer } = header
      if (typeof renderer == 'function') {
        title = renderer.call(this, column)
      }
    } else {
      title = header
    }

    return html`
      ${title}
    `
  }

  _renderSortHeader(column, sorters) {
    if (column.hidden) {
      return html``
    }

    var sorter = sorters.find(sorter => column.type !== 'gutter' && column.name == sorter.name)
    if (!sorter) {
      return html``
    }

    if (sorters.length > 1) {
      var rank = sorters.indexOf(sorter) + 1
      return sorter.descending
        ? html`
            &#9650;<sub>${rank}</sub>
          `
        : html`
            &#9660;<sub>${rank}</sub>
          `
    } else {
      return sorter.descending
        ? html`
            &#9650;
          `
        : html`
            &#9660;
          `
    }
  }

  _changeSort(column) {
    if (!column.sortable) {
      return
    }

    var sorters = [...this.sorters]

    var idx = sorters.findIndex(sorter => sorter.name == column.name)
    if (idx !== -1) {
      let sorter = sorters[idx]
      if (sorter.descending) {
        sorters.splice(idx, 1)
      } else {
        sorter.descending = true
      }
    } else {
      var sorter = {
        name: column.name
      }

      sorters.push(sorter)
    }

    this.sorters = sorters

    this.dispatchEvent(
      new CustomEvent('sorters-changed', {
        bubbles: true,
        composed: true,
        detail: this.sorters
      })
    )
  }

  _dragStart(e, idx) {
    var target = e.target
    var startX = e.offsetX

    // var dragHandler = (e => {
    //   let column = {
    //     ...this.columns[idx]
    //   }

    //   column.width = Math.max(0, Number(column.width) + e.offsetX - startX)

    //   this.dispatchEvent(
    //     new CustomEvent('column-sort-changed', {
    //       bubbles: true,
    //       composed: true,
    //       detail: {
    //         idx,
    //         column
    //       }
    //     })
    //   )
    // }).bind(this)

    var dragEndHandler = (e => {
      // target.removeEventListener('drag', dragHandler)
      target.removeEventListener('dragend', dragEndHandler)

      let column = {
        ...this.columns[idx]
      }

      column.width = Math.max(0, Number(column.width) + e.offsetX - startX)

      this.dispatchEvent(
        new CustomEvent('column-length-changed', {
          bubbles: true,
          composed: true,
          detail: {
            idx,
            column
          }
        })
      )
    }).bind(this)

    // target.addEventListener('drag', dragHandler)
    target.addEventListener('dragend', dragEndHandler)
  }
}

customElements.define('data-grid-header', DataGridHeader)
