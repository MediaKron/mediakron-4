import Content from '@/views/site/content/Content';
import MyContent from '@/views/site/content/MyContent';
import AllContent from '@/views/site/content/AllContent';
import AddContent from '@/views/site/content/AddContent';
import Authors from '@/views/site/content/Authors';
import CreateContent from '@/views/site/items/Create';


export default [
    {
        path: "mycontent",
        name: 'mycontent',
        component: MyContent,
        props: true
    },
    {
        path: "all/:page?",
        name: 'allcontent',
        component: AllContent,
        props: true
    },
    {
        path: "authors",
        name: 'authors',
        component: Authors,
        props: true
    },
    {
        path: "add",
        name: 'add',
        component: AddContent,
        props: true
    },
    {
        path: "add/:type",
        name: 'add',
        component: CreateContent,
        props: true
    },
    {
        path: "/",
        name: 'content',
        component: Content,
        props: true
    }
]
