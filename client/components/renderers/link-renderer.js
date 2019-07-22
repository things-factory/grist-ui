import { html } from 'lit-html'

export const LinkRenderer = (column, record, rowIndex) => {
  var { href, target } = column.record.options || {}

  var value = record[column.name]
  value = value === undefined ? '' : value

  if (typeof href == 'function') {
    href = href.call(this, column, record, rowIndex)
  }

  return target
    ? html`
        <a style="text-decoration:none;color:inherit" href=${href || value} target=${target}>${value}</a>
      `
    : html`
        <a style="text-decoration:none;color:inherit" href=${href || value}>${value}</a>
      `
}
