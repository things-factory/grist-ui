import { getHandler } from '../handlers'

export const buildRowsOptions = rows => {
  var { appendable = true, insertable = false, selectable, groups = [] } = rows

  /* handler */
  var { click, dblclick } = rows.handlers || {}

  return {
    appendable,
    insertable,
    selectable,
    groups,
    handlers: {
      click: getHandler(click),
      dblclick: getHandler(dblclick)
    }
  }
}
