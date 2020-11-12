export const SelectRenderer = (value, column, record, rowIndex, field) => {
  if (!value) {
    return ''
  }
  var rowOptionField = record[column.record.rowOptionField]
  var options = rowOptionField?.options ? rowOptionField.options : column.record.options

  var res = options.filter(option => option.value == value)
  if (res.length) return res[0].display
  return value
}
