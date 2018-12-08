import Layout from '@/views/layouts/Layout';
import HomePage from '@/views/homepage/Homepage';
import ItemPage from '@/views/items/Item';

export default {
    path: '/:site',
    component: Layout,
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
        path: '/',
        name: 'homepage',
        component: HomePage,
        props: true,
      }
    ],
}
