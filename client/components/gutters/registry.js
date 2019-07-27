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

export function registerGutter(name, gutter) {
  gutters[name] = gutter
}

export function unregisterGutter(name) {
  delete gutters[name]
}

export const generateGutterColumn = config => {
  var clazz = gutters[config.name]

  if (clazz) {
    return clazz.instance(config)
  }
}
