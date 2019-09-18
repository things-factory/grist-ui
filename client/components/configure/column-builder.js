import { generateGutterColumn } from '../gutters'
import { getRenderer } from '../renderers'
import { getEditor } from '../editors'
import { getHandler } from '../handlers'

export const buildColumn = column => {
  var compiled = { ...column }

  if (column.type == 'gutter') {
    compiled = generateGutterColumn(column)
  }

  var { header = {}, record = {}, handlers = {} } = compiled

  /* header */

  if (typeof header == 'string') {
    compiled.header = {
      renderer: () => header,
      translation: !(column.type == 'gutter')
    }
  } else {
    /* gutter type인 경우는 translation default 설정이 false 가 된다. */
    var { renderer: headerRenderer, translation = !(column.type == 'gutter') } = header

    compiled.header = {
      ...header,
      renderer: getRenderer(headerRenderer),
      translation
    }
  }

  /*
   * record
   *
   * record 경우는 translation default 설정이 false 가 된다.
   */
  var { renderer: recordRenderer, editor, editable, translation = false } = record

  if (!recordRenderer) {
    recordRenderer = getRenderer(column.type)
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
    renderer: recordRenderer,
    editor,
    translation
  }

  /* handler */
  var { click, dblclick } = handlers

  compiled.handlers = {
    click: getHandler(click),
    dblclick: getHandler(dblclick)
  }

  return compiled
}
