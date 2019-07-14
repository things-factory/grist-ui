export class GutterSequence {
  static instance(config = {}) {
    return {
      type: 'gutter',
      name: 'sequence',
      width: function(column) {
        var lastIndex = (this.page - 1) * this.limit + this.records.length
        return `minmax(20px, ${String(lastIndex).length * 11}px)`
      },
      sortable: false,
      header: '#',
      record: {
        renderer: function(column, idx) {
          return (this.page - 1) * this.limit + idx + 1
        },
        align: 'center'
      }
    }
  }
}
