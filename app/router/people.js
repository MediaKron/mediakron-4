
import PeopleList from '@/views/site/options/people/PeopleList';
import PeopleAdd from '@/views/site/options/people/PeopleAdd';

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
        path: "options/people/add",
        component: PeopleAdd,
        title: "Add People",
        name: "people-add"
      },
    ]
