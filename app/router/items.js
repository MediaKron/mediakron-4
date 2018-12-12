import SiteLayout from '@/views/layouts/SiteLayout';
import HomePage from '@/views/homepage/Homepage';
import ItemPage from '@/views/items/Item';
import Browse from '../views/items/Browse';

export default {
    path: '/:site',
    component: SiteLayout,
    title: 'Site',
    props: true,
    children: [
      {
        path: ':first/:second?/:third?',
        name: 'item',
        component: ItemPage,
        props: true,
      },
      {
        path: '/browse',
        name: 'browser',
        component: Browse,
        props: true,
      },
      {
        path: '/',
        name: 'homepage',
        component: HomePage,
        props: true,
      }
    ],
}
