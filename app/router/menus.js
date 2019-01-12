
import Menus from '@/views/site/siteadmin/Menus';
import MenusAppearance from '@/views/site/siteadmin/MenusAppearance';

export default [
      {
        path: 'appearance',
        name: 'menus_appearance',
        component: MenusAppearance
      },
      {
        path: '/',
        component: Menus,
        title: "menus_index",
        props: true,
      }
    ]
