import {
  TextInput,
  NumberInput,
  Select,
  CheckboxInput,
  DateInput,
  TimeInput,
  DateTimeInput,
  ColorInput
} from './input-editors'

var editors = {
  string: TextInput,
  integer: NumberInput,
  float: NumberInput,
  progress: NumberInput,
  select: Select,
  boolean: CheckboxInput,
  date: DateInput,
  time: TimeInput,
  datetime: DateTimeInput,
  color: ColorInput
}

export function registerEditor(type, editor) {
  editors[type] = editor
}

export function unregisterEditor(type) {
  delete editors[type]
}

export function getEditor(type) {
  if (typeof type == 'function') {
    return type
  }

  return function(column, record, row) {
    var clazz = editors[type] || TextInput

    var element = new clazz()

    element.row = row
    element.record = record
    element.column = column

    return element
  }
}
