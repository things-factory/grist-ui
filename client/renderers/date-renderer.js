// TODO 로케일 설정에 따라서 포맷이 바뀌도록 해야한다.
const DATETIME_OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23'
}

const DATE_OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
}

const TIME_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}

const OPTIONS = {
  datetime: DATETIME_OPTIONS,
  time: TIME_OPTIONS,
  date: DATE_OPTIONS
}

function getsec(time) {
  var arr = time.split(':')
  return arr[0] * 3600 + arr[1] * 60 + (arr[2] || 0)
}

/* 
  TODO date, time, month, week 등 datetime 이 외의 타입인 경우에는 문자열로 처리하도록 한다. 
  따라서, 이 경우는 타임존에 대한 처리가 불필요하다.
*/
export const DateRenderer = (value, column, record, rowIndex, field) => {
  if (!value) {
    return ''
  }

  if (!isNaN(Number(value))) value = Number(value)

  var options = column.record.options || OPTIONS[column.type]
  var formatter = new Intl.DateTimeFormat(navigator.language, options)

  switch (column.type) {
    case 'datetime':
      return formatter.format(new Date(value))
    case 'date':
      return formatter.format(new Date(value))
    case 'time':
      return value
  }
}
