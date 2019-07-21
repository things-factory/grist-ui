import { generateGutterColumn } from '../gutters'
import { getRenderer } from '../renderers'
import { getEditor } from '../editors'

export const buildColumn = column => {
  var compiled = { ...column }

  if (column.type == 'gutter') {
    compiled = generateGutterColumn(column)
  }

  var { record = {} } = compiled
  var { renderer, editor, editable } = record

  if (!renderer) {
    renderer = getRenderer(column.type)
  }

  if (editable && typeof editor !== 'function') {
    if (!editor) {
      editor = getEditor(column.type)
    } else {
      editor = getEditor(editor)
    }
  }

  compiled.record = {
    ...record,
    renderer,
    editor
  }

  return compiled
}
