import { RecordViewHandler } from './record-view-handler'
import { RecordFormHandler } from './record-form-handler'
import { SelectRow } from './select-row'
import { SelectRowToggle } from './select-row-toggle'

const NOOP = () => {}

var handlers = {
  'record-view': RecordViewHandler,
  'record-form': RecordFormHandler,
  'select-row': SelectRow,
  'select-row-toggle': SelectRowToggle
}

export function registerHandler(type, handler) {
  handlers[type] = handler
}

export function unregisterHandler(type) {
  delete handlers[type]
}

export function getHandler(type) {
  if (typeof type == 'function') {
    return type
  }

  return handlers[type] || NOOP
}
