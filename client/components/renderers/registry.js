import { BooleanRenderer } from './boolean-renderer'
import { TextRenderer } from './text-renderer'
import { DateRenderer } from './date-renderer'
import { ColorRenderer } from './color-renderer'
import { ProgressRenderer } from './progress-render'
import { ObjectRenderer } from './object-renderer'
import { LinkRenderer } from './link-renderer'

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
  color: ColorRenderer,
  progress: ProgressRenderer,
  object: ObjectRenderer,
  link: LinkRenderer
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
