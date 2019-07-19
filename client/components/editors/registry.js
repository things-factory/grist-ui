var editors = {}

export function registerEditor(type, editor) {
  editors[type] = editor
}

export function unregisterEditor(type) {
  delete editors[type]
}

export function getEditor(column, record, row) {
  var clazz = editors[column.type]

  var element = new clazz()

  element.row = row
  element.record = record
  element.column = column
  element.value = record[column.name]

  return element
}
