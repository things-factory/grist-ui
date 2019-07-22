import { GutterSequence } from './gutter-sequence'
import { GutterRowSelector } from './gutter-row-selector'
import { GutterButton } from './gutter-button'
import { GutterDirty } from './gutter-dirty'

export const generateGutterColumn = config => {
  var name = config.name

  switch (name) {
    case 'sequence':
      return GutterSequence.instance(config)

    case 'row-selector':
      return GutterRowSelector.instance(config)

    case 'button':
      return GutterButton.instance(config)

    case 'dirty':
      return GutterDirty.instance(config)

    default:
      return
  }
}
