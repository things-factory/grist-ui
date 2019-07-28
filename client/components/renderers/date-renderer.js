// TODO 로케일 설정에 따라서 포맷이 바뀌도록 해야한다.
const OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false
  // timeZone: 'America/Los_Angeles'
}

export const DateRenderer = (column, record, rowIndex) => {
  var value = Number(record[column.name])
  var options = column.record.options || OPTIONS
  var formatter = new Intl.DateTimeFormat(navigator.language, options)

  return formatter.format(isNaN(value) ? new Date() : new Date(value))
}
