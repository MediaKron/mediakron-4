
import PeopleList from '@/views/site/options/people/PeopleList';
import PeopleAdd from '@/views/site/options/people/PeopleAdd';
import Groups from '@/views/site/options/people/Groups';

export default [
      {
        path: 'list',
        name: 'people_list',
        component: PeopleList,
        props: true,
        meta:{
          inPeople: true
        }
      },
      
      {
        path: '/',
        component: PeopleList,
        title: "people_index",
        props: true,
        meta:{
          inPeople: true
        }
      },

      {
        path: "add",
        component: PeopleAdd,
        title: "Add People",
        name: "people-add",
        meta:{
          inPeople: true
        }
      },
      {
        path: 'groups',
        component: Groups,
        name: "groups",
        props: true,
        meta:{
          inPeople: true
        }
      },
    ]
