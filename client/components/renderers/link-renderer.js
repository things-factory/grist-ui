import { html } from 'lit-html'

export const LinkRenderer = (value, column, record) => {
  var { href, target } = column.record.options || {}

  value = value === undefined ? '' : value

  if (typeof href == 'function') {
    href = href.call(null, value, column, record)
  }

  return target
    ? html`
        <a style="text-decoration:none;color:inherit" href=${href || value} target=${target}>${value}</a>
      `
    : html`
        <a style="text-decoration:none;color:inherit" href=${href || value}>${value}</a>
      `
}
