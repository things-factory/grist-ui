import { generateGutterColumn } from '../gutters'
import { getRenderer } from '../renderers'

export const buildColumn = column => {
  var compiled = { ...column }

  if (column.type == 'gutter') {
    compiled = generateGutterColumn(column)
  }

  var { record = {} } = compiled

  if (!record.renderer) {
    compiled.record = {
      ...record,
      renderer: getRenderer(column.type)
    }
  }

  return compiled
}
