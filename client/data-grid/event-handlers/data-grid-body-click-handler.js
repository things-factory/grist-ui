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

  if (!this.focused || rowIndex !== this.focused.row || columnIndex !== this.focused.column) {
    this.focused = {
      row: rowIndex,
      column: columnIndex
    }

    this.editTarget = null
  }

  /* do column click handler */
  if (column) {
    var { click } = column.handlers
    click && click(this.columns, this.data, column, record, rowIndex, target)
  }

  /* do rows click handler */
  var { click: rowsClick } = this.config.rows.handlers
  rowsClick && rowsClick(this.columns, this.data, column, record, rowIndex, target)
}
