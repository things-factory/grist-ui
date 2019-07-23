/**
 * data-grid-body 의 click handler
 *
 * - handler의 this 는 data-grid-body임.
 */
export function dataGridBodyClickHandler(e) {
  e.stopPropagation()

  /* target should be 'data-grid-field' */
  var target = e.target
  var { column, record, rowIndex, columnIndex } = target

  if (!isNaN(rowIndex) && !isNaN(columnIndex)) {
    if (!this.focused || (rowIndex !== this.focused.row || columnIndex !== this.focused.column)) {
      this.focused = {
        row: rowIndex,
        column: columnIndex
      }

      this.editTarget = null
    }
  } else {
    console.error('should not be here.')
  }

  /* do click handler */
  var { click } = column.handlers
  click && click.call(target, this.columns, this.data, column, record, rowIndex)
}
