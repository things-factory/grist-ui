import route from './client/route'
import bootstrap from './client/bootstrap'

export default {
  route,
  routes: [
    {
      tagname: 'grid-test',
      page: 'grid-test'
    },
    {
      tagname: 'list-test',
      page: 'list-test'
    },
    {
      tagname: 'glister-test',
      page: 'glister-test'
    }
  ],
  bootstrap
}
