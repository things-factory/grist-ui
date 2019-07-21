export const ColorRenderer = (column, record, rowIndex) => {
  var value = record[column.name]
  return value === undefined ? '' : value
}
