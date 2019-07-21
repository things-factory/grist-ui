import { generateGutterColumn } from '../gutters'
import { getRenderer } from '../renderers'
import { getEditor } from '../editors'

export const buildColumn = column => {
  var compiled = { ...column }

  if (column.type == 'gutter') {
    compiled = generateGutterColumn(column)
  }

  var { record = {} } = compiled
  var { renderer, editor } = record

  if (!renderer) {
    renderer = getRenderer(column.type)
  }
  if (!editor) {
    editor = getEditor(column.type)
  }

  compiled.record = {
    ...record,
    renderer,
    editor
  }

  return compiled
}
