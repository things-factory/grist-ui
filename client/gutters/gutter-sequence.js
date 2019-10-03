export class GutterSequence {
  static instance(config = {}) {
    return Object.assign(
      {},
      {
        type: 'gutter',
        name: '__seq__',
        getterType: 'sequence',
        width: function(column) {
          if (this.data) {
            var { limit = 0, page = 1, total = 0, records = [] } = this.data || {}
            var lastIndex = (page - 1) * limit + records.length
          } else {
            var lastIndex = 100
          }
          return `${Math.max(20, String(lastIndex).length * 11)}px`
        },
        resizable: false,
        sortable: false,
        header: '#',
        record: {
          renderer: function(value, column, record, rowIndex, field) {
            return value
          },
          align: 'center'
        },
        forGrid: true,
        forList: false
      },
      config
    )
  }
}
