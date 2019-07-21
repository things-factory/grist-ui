import { html } from 'lit-html'

export const ColorRenderer = (column, record, rowIndex) => {
  var value = record[column.name]
  value = value === undefined ? '#000' : value

  return html`
    <div style="display:block;background-color:${value}">${value}</div>
  `
}
