import { TextInput, NumberInput, Select, CheckboxInput } from './input-editors'

var editors = {
  string: TextInput,
  integer: NumberInput,
  float: NumberInput,
  select: Select,
  boolean: CheckboxInput
}

export function registerEditor(type, editor) {
  editors[type] = editor
}

export function unregisterEditor(type) {
  delete editors[type]
}

export function getEditor(type) {
  return function(column, record, row) {
    var clazz = editors[type]

    var element = new clazz()

    element.row = row
    element.record = record
    element.column = column
    element.value = record[column.name]

    return element
  }
}
