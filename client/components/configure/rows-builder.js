import { getHandler } from '../handlers'

export const buildRows = rows => {
  /* handler */
  var { click, dblclick } = rows.handlers || {}

  return {
    handlers: {
      click: getHandler(click),
      dblclick: getHandler(dblclick)
    }
  }
}
