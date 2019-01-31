
import Menus from '@/views/site/options/menus/Menus';
import MenusAppearance from '@/views/site/options/menus/MenusAppearance';

export default [
      {
        path: 'appearance',
        name: 'menus_appearance',
        component: MenusAppearance,
        meta:{
          inMenus: true
        }
      },
      {
        path: '/',
        component: Menus,
        title: "menus_index",
        name: 'menus',
        props: true,
        meta:{
          inMenus: true
        }
      }
    ]
