import { html } from 'lit-html'

export const BooleanRenderer = (value, column, record, rowIndex, field) => {
  return html`
    <input type="checkbox" .checked=${!!value} disabled center />
  `
}
