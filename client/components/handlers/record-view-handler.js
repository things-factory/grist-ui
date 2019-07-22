import { html } from 'lit-html'
import { openPopup } from '@things-factory/layout-base'
import '../record-view'

const STYLE = 'width: 50vw;height: 50vh'

export const RecordViewHandler = function(columns, column, record, rowIndex) {
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
