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

import { ObjectEditor } from './object-editor'

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
  color: ColorInput,
  object: ObjectEditor
}

export function registerEditor(type, editor) {
  editors[type] = editor
}

export function unregisterEditor(type) {
  delete editors[type]
}

export function getEditor(type) {
  return function(column, record, row) {
    var clazz = editors[type] || TextInput

    var element = new clazz()

    element.row = row
    element.record = record
    element.column = column

    return element
  }
}
