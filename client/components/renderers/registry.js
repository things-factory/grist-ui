import { BooleanRenderer } from './boolean-renderer'
import { TextRenderer } from './text-renderer'

var renderer = {
  string: TextRenderer,
  integer: TextRenderer,
  float: TextRenderer,
  select: TextRenderer,
  boolean: BooleanRenderer
}

export function registerRenderer(type, renderer) {
  renderer[type] = renderer
}

export function unregisterRenderer(type) {
  delete renderer[type]
}

export function getRenderer(column, record, row) {
  var clazz = renderer[column.type]

  var element = new clazz()

  element.row = row
  element.record = record
  element.column = column
  element.value = record[column.name]

  return element
}
