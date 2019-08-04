import { html } from 'lit-html'

export const BooleanRenderer = (value, column, record) => {
  return html`
    <input type="checkbox" .checked=${!!value} disabled center />
  `
}
