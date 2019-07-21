import { BooleanRenderer } from './boolean-renderer'
import { TextRenderer } from './text-renderer'
import { DateRenderer } from './date-renderer'
import { ColorRenderer } from './color-renderer'

var renderer = {
  string: TextRenderer,
  integer: TextRenderer,
  float: TextRenderer,
  number: TextRenderer,
  select: TextRenderer,
  boolean: BooleanRenderer,
  date: DateRenderer,
  time: DateRenderer,
  datetime: DateRenderer,
  color: ColorRenderer
}

export function registerRenderer(type, renderer) {
  renderer[type] = renderer
}

export function unregisterRenderer(type) {
  delete renderer[type]
}

export function getRenderer(type) {
  return renderer[type] || TextRenderer
}
