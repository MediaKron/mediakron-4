
import Menus from '@/views/site/options/menus/Menus';
import MenusAppearance from '@/views/site/options/menus/MenusAppearance';

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
