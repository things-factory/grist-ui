import { getHandler } from '../handlers'

export const buildRowsOptions = rows => {
  var { appendable = true, insertable = false, selectable } = rows

  /* handler */
  var { click, dblclick } = rows.handlers || {}

  return {
    appendable,
    insertable,
    selectable,
    handlers: {
      click: getHandler(click),
      dblclick: getHandler(dblclick)
    }
  }
}
