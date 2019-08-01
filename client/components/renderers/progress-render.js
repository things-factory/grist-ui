import { LitElement, html, css } from 'lit-element'

class DataGristProgressRenderer extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }

      #border {
        display: block;
        position: absolute;

        height: 100%;
        width: 100%;
        box-sizing: border-box;

        border: 1px solid var(--primary-color);
        background-color: transparent;
      }

      #bar {
        background-color: var(--data-grist-progress-color, var(--primary-color));
        text-align: left;
      }
    `
  }

  static get properties() {
    return {
      value: Number
    }
  }

  render() {
    var value = this.value

    return html`
      <div id="border"></div>
      <div id="bar" style="width:${value}%">
        &nbsp;${isNaN(value) ? '' : value}
      </div>
    `
  }
}

customElements.define('data-grist-progress-renderer', DataGristProgressRenderer)

export const ProgressRenderer = (column, record, rowIndex) => {
  var { min = 0, max = 100 } = column.record.options || {}
  var value = Number(record[column.name])
  value = Number(value)

  var progress = isNaN(value) ? 0 : Math.min(100, Math.max(0, ((value - min) * 100) / (max - min)))

  return html`
    <data-grist-progress-renderer .value=${progress}></data-grist-progress-renderer>
  `
}
