export class GutterSequence {
  static instance(config = {}) {
    return {
      type: 'gutter',
      name: 'sequence',
      width: function(column) {
        var { limit = 0, page = 1, total = 0, records = [] } = this.data || {}
        var lastIndex = (page - 1) * limit + records.length
        return `minmax(20px, ${String(lastIndex).length * 11}px)`
      },
      resizable: false,
      sortable: false,
      header: '#',
      record: {
        renderer: function(column, idx) {
          var { limit = 0, page = 1, total = 0, records = [] } = this.data || {}
          return (page - 1) * limit + idx + 1
        },
        align: 'center'
      }
    }
  }
}
