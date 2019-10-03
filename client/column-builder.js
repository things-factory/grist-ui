/*   
column format
{
  type: 'string' (default) | 'number' | 'boolean' | 'gutter',
  name: 'column name',
  width: sizeof column width as number,
  resizable: true or undefined(default) | false,
  hidden: true | false,
  sortable: true | false or undefined (default),
  header: {
    renderer: 'column renderer' | function(column, records) | default function as undefined,
    decorator: 'column renderer' | function(column, records) | default function as undefined,
  },
  record: {
    renderer: 'column renderer' | function(column, records) | default function as undefined,
    editor: {
      type: 'string' (default) | 'number' | 'checkbox' | 'select' | 'tristate' | 'button' | 'user defined',
      option: array | object | function(item, records, column)
    },
    decorators: ['stripe'],
    align: 'left' | 'right' | 'center'
  }
}
*/

export class ColumnBuilder {
  build(config) {
    var { columns } = config
    var built = columns.map(column => {
      let {
        type,
        name,
        width,
        hidden = false,
        resizable = true,
        editable = false,
        sortable = false,
        headRenderer,
        dataRenderer,
        editor
      } = column

      switch (type) {
        case 'string':
        case 'boolean':
        case 'float':
        case 'integer':
        case 'object':
        case 'gutter':
        default:
      }
    })

    return built
  }
}
