function _calculateTotalPage(limit, total) {
  return Math.ceil(total / limit)
}

const NOOP = function() {}

export class DataProvider {
  constructor(grist) {
    this.grist = grist
    this._fetchHandler = null
    this._editHandler = null

    this._pageChangeHandler = this.onPageChange.bind(this)
    this._limitChangeHandler = this.onLimitChange.bind(this)
    this._sortersChangeHandler = this.onSortersChange.bind(this)
    this._recordChangeHandler = this.onRecordChange.bind(this)

    this.grist.addEventListener('page-changed', this._pageChangeHandler)
    this.grist.addEventListener('limit-changed', this._limitChangeHandler)
    this.grist.addEventListener('sorters-changed', this._sortersChangeHandler)
    this.grist.addEventListener('record-change', this._recordChangeHandler)
  }

  dispose() {
    this.grist.removeEventListener('page-changed', this._pageChangeHandler)
    this.grist.removeEventListener('limit-changed', this._limitChangeHandler)
    this.grist.removeEventListener('sorters-changed', this._sortersChangeHandler)
    this.grist.removeEventListener('record-change', this._recordChangeHandler)
  }

  onPageChange(e) {
    var page = e.detail
    this.fetch({ page })
  }

  onLimitChange(e) {
    var limit = e.detail
    this.fetch({ limit })
  }

  onSortersChange(e) {
    this.sorters = e.detail
    this.fetch()
  }

  onRecordChange(e) {
    this.editHandler.call()
  }

  get fetchOptions() {
    return this._fetchOptions
  }

  set fetchOptions(fetchOptions) {
    this._fetchOptions = fetchOptions

    this.fetch()
  }

  get fetchHandler() {
    return this._fetchHandler || NOOP
  }

  set fetchHandler(fetchHandler) {
    this._fetchHandler = fetchHandler
  }

  get editHandler() {
    return this._editHandler || NOOP
  }

  set editHandler(editHandler) {
    this._editHandler = editHandler
  }

  async attach() {
    var { page = 0, limit = 20 } = this

    // total이 변했을 수도 있으므로, 현재페이지보다 하나 큰 페이지를 요청한다.
    page = page + 1

    return this._update({
      /* fetch에서 limit과 page를 제공하지 않는 경우를 대비함. */
      limit,
      page,
      ...(await this.fetchHandler.call(null, {
        page,
        limit,
        sorters: this.sorters,
        options: this.fetchOptions
      }))
    })
  }

  async fetch({ page = this.page, limit = this.limit, sorters = this.sorters } = {}) {
    /* fetchHandler should reture { page, limit, total, records } */
    this.records = null

    this.sorters = sorters

    return this._update({
      /* fetch에서 limit과 page를 제공하지 않는 경우를 대비함. */
      limit,
      page,
      ...(await this.fetchHandler.call(null, {
        page,
        limit,
        sorters,
        options: this.fetchOptions
      }))
    })
  }

  async _update({ page, limit, total, records }) {
    // total을 감안해서 page가 최대값을 넘지 않도록 한다.
    var maxpage = _calculateTotalPage(limit, total)
    if (maxpage < page) {
      return await this.fetch({ page: maxpage, limit })
    }

    if (!records) {
      return
    }

    if (!this.records) {
      this.records = records
    } else if (this.page < page) {
      // attach인 경우에는 records를 append한다.
      this.records = [...this.records, ...records]
    } else {
      return
    }

    this.limit = limit
    this.total = total
    this.page = page

    this.grist.data = {
      page: this.page,
      limit: this.limit,
      total: this.total,

      records: this.records
    }
  }
}
