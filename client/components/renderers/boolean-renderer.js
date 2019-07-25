import { html } from 'lit-html'

export const BooleanRenderer = (column, record, rowIndex) => {
  var value = record[column.name]

  return html`
    <input type="checkbox" .checked=${!!value} disabled />
  `
}
