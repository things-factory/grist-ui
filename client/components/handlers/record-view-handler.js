import { html } from 'lit-html'
import { openPopup } from '@things-factory/layout-base'
import '../record-view'

const STYLE = 'width: 50vw;height: 50vh'

/*
 * handler들은 data-grid-field 로부터 호출되는 것을 전제로 하며,
 * 전반적인 처리를 위해서, columns 및 data 정보를 포함해서 제공할 수 있어야 한다.
 */

export const RecordViewHandler = function(columns, data, column, record, rowIndex) {
  var field = this /* data-grid-field */

  openPopup(
    html`
      <record-view
        style=${STYLE}
        .field=${field}
        .columns=${columns}
        .column=${column}
        .record=${record}
        .rowIndex=${rowIndex}
      ></record-view>
    `,
    {
      backdrop: true
    }
  )
}
