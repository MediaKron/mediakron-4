
import PeopleList from '@/views/site/options/people/PeopleList';
import PeopleAdd from '@/views/site/options/people/PeopleAdd';
import Groups from '@/views/site/options/people/Groups';

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
      },

      {
        path: "add",
        component: PeopleAdd,
        title: "Add People",
        name: "people-add"
      },
      {
        path: 'groups',
        component: Groups,
        name: "groups",
        props: true,
      },
    ]
