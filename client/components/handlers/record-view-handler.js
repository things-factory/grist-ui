import { html } from 'lit-html'
import { openPopup } from '@things-factory/layout-base'
import '../record-view/record-view'

/*
 * handler들은 data-grid-field 로부터 호출되는 것을 전제로 하며,
 * 전반적인 처리를 위해서, columns 및 data 정보를 포함해서 제공할 수 있어야 한다.
 */

export const RecordViewHandler = function(columns, data, column, record, rowIndex, field) {
  openPopup(
    html`
      <record-view
        .field=${field}
        .columns=${columns}
        .column=${column}
        .record=${record}
        .rowIndex=${rowIndex}
      ></record-view>
    `,
    {
      backdrop: true,
      size: 'large',
      title: record['name']
    }
  )
}
