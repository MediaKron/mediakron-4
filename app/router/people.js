
import PeopleList from '@/views/site/siteadmin/PeopleList';

export default [
      {
        path: 'list',
        name: 'people_list',
        component: PeopleList,
        props: true,
      },
      {
        path: '/',
        component: PeopleList,
        title: "people_index",
        props: true,
      }
    ]
