import { html } from 'lit-html'

export const ProgressRenderer = (column, record, rowIndex) => {
  var { min = 0, max = 100 } = column.record.options || {}
  var value = record[column.name]
  value = value === undefined ? 0 : Number(value)

  var progress = Math.min(100, Math.max(0, ((value - min) * 100) / (max - min)))

  return html`
    <div style="display:block;border:1px solid green;background-color:transparent">
      <div style="width:${progress}%;background-color:green;text-align:left;">${value}</div>
    </div>
  `
}
