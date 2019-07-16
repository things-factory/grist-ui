export default function route(page) {
  switch (page) {
    case 'index':
      return 'glister-test'

    case 'grid-test':
      import('./pages/grid-test')
      return page

    case 'list-test':
      import('./pages/list-test')
      return page

    case 'glister-test':
      import('./pages/glister-test')
      return page
  }
}
