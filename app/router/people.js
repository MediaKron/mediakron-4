
import People from '@/views/site/siteadmin/People';
import PeopleList from '@/views/site/siteadmin/PeopleList';

export default [
      {
        path: 'list',
        name: 'people_list',
        component: PeopleList
      },
      {
        path: '/',
        component: People,
        title: "people_index",
        props: true,
      }
    ]
