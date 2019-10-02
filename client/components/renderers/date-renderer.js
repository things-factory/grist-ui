// TODO 로케일 설정에 따라서 포맷이 바뀌도록 해야한다.
const OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
  // timeZone: 'America/Los_Angeles'
}

export const DateRenderer = (value, column, record, rowIndex, field) => {
  if (!value) {
    return ''
  }

  var options = column.record.options || OPTIONS
  var formatter = new Intl.DateTimeFormat(navigator.language, options)

  return formatter.format(new Date(Number(value)))
}
