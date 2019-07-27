import { GutterSequence } from './gutter-sequence'
import { GutterRowSelector } from './gutter-row-selector'
import { GutterButton } from './gutter-button'
import { GutterDirty } from './gutter-dirty'

var gutters = {
  sequence: GutterSequence,
  'row-selector': GutterRowSelector,
  button: GutterButton,
  dirty: GutterDirty
}

export function registerGutter(type, gutter) {
  gutters[type] = gutter
}

export function unregisterGutter(type) {
  delete gutters[type]
}

export const generateGutterColumn = config => {
  var clazz = gutters[config.type]

  if (clazz) {
    return clazz.instance(config)
  }
}
