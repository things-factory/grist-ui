import './column-builder'
import { buildColumn } from './column-builder'

export const buildConfig = config => {
  var compiled = {
    ...config
  }

  var { columns = [] } = config
  compiled.columns = columns.map(column => buildColumn(column))

  return compiled
}
