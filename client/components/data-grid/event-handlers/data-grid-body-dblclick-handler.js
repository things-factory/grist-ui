/**
 * data-grid-body 의 dblclick handler
 *
 * - handler의 this 는 data-grid-body임.
 */
export async function dataGridBodyDblclickHandler(e) {
  e.stopPropagation()

  /* target should be 'data-grid-field' */
  var target = e.target
  var { record, rowIndex, columnIndex, column } = target

  if (!column) {
    /* 여백 컬럼이 클릭된 경우 */
    return
  }

  if (!isNaN(rowIndex) && !isNaN(columnIndex)) {
    this.startEditTarget(rowIndex, columnIndex)
  } else {
    console.error('should not be here.')
    return
  }

  /* do column dblclick handler */
  var { dblclick } = column.handlers
  dblclick && dblclick.call(target, this.columns, this.data, column, record, rowIndex)

  /* do rows dblclick handler */
  var { click: rowsDblclick } = this.config.rows.handlers
  rowsDblclick && rowsDblclick.call(target, this.columns, this.data, column, record, rowIndex)
}
