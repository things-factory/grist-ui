import { RecordViewHandler } from './record-view-handler'

const NOOP = () => {}

var handlers = {
  'record-view': RecordViewHandler
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
