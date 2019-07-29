import { getHandler } from '../handlers'

export const buildRows = rows => {
  var { appendable = false, insertable = false, selectable } = rows

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
