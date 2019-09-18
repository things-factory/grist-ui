import './column-builder'
import { buildColumn } from './column-builder'
import { buildRows } from './rows-builder'

export const buildConfig = config => {
  var { columns = [], rows = {}, pagination = {} } = config

  return {
    ...config,
    columns: columns.map(column => buildColumn(column)),
    rows: buildRows(rows),
    pagination
  }
}
