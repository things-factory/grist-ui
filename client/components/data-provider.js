function _calculateTotalPage(limit, total) {
  return Math.ceil(total / limit)
}

export class DataProvider {
  constructor(fetcher, limit) {
    this.fetcher = fetcher

    this.limit = limit

    this.page = 0
    this.total = -1
    this.records = null

    this.filters = []
    this.sorters = []
  }

  get filters() {
    this._filters
  }

  set filters(filters) {
    this._filters = filters
  }

  async attach() {
    // total이 변했을 수도 있으므로, 현재페이지보다 하나 큰 페이지를 요청한다.
    var page = this.page + 1

    return this._update({
      /* fetch에서 limit과 page를 제공하지 않는 경우를 대비함. */
      limit: this.limit,
      page,
      ...(await this.fetch(page, this.limit, this.filters, this.sorters))
    })
  }

  async fetch(page, limit, filters, sorters) {
    /* fetcher should reture { page, limit, total, records } */
    this._records = null

    this.filters = filters
    this.sorters = sorters

    return this._update({
      /* fetch에서 limit과 page를 제공하지 않는 경우를 대비함. */
      limit,
      page,
      ...(await this.fetcher.call(null, {
        page,
        limit,
        filters,
        sorters
      }))
    })
  }

  _update({ page, limit, total, records }) {
    this.limit = limit
    this.total = total

    // total을 감안해서 page가 최대값을 넘지 않도록 한다.
    this.page = Math.max(0, Math.min(_calculateTotalPage(limit, total), page))

    if (!this.records) {
      this.records = records
    } else {
      // attach인 경우에는 records를 append한다.
      this.records = [...this.records, ...records]
    }

    return {
      page: this.page,
      limit: this.limit,
      total: this.total,

      records: this.records
    }
  }
}
