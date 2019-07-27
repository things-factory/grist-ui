import { NumberFormatter } from './number-formatter'
import { DateFormatter } from './date-formatter'
import { TextFormatter } from './text-formatter'

const NOOP = () => {}

var formatters = {
  number: NumberFormatter,
  date: DateFormatter,
  text: TextFormatter
}

export function registerFormatter(type, formatter) {
  formatters[type] = formatter
}

export function unregisterFormatter(type) {
  delete formatters[type]
}

export function getFormatter(type) {
  if (typeof type == 'function') {
    return type
  }

  return formatters[type] || NOOP
}
