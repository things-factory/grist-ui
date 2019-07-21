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

export function getRenderer(type) {
  return renderer[type]
}
