import Content from '@/views/site/content/Content';
import MyContent from '@/views/site/content/MyContent';
import AllContent from '@/views/site/content/AllContent';
import AllContentTable from '@/views/site/content/AllContentTable';
import AddContent from '@/views/site/content/AddContent';
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
        path: "alltable/:page?",
        name: 'allcontenttable',
        component: AllContentTable,
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
