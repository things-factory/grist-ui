import './column-builder'
import { buildColumn } from './column-builder'
import { buildRows } from './rows-builder'

export const buildConfig = config => {
  var compiled = {
    ...config
  }

  var { columns = [], rows = {} } = config
  compiled.columns = columns.map(column => buildColumn(column))
  compiled.rows = buildRows(rows)

  return compiled
}
