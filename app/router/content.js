import MyContent from '@/views/site/content/MyContent';
import AllContent from '@/views/site/content/AllContent';
import AddContent from '@/views/site/content/AddContent';
import Authors from '@/views/site/content/Authors';
import Deleted from '@/views/site/content/Deleted';
import Archived from '@/views/site/content/Archived';
import Import from '@/views/site/content/Import';
import Export from '@/views/site/content/Export';
import CreateContent from '@/views/site/items/Create';
import Item from "@/views/site/items/Item";

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
        path: "deleted",
        name: 'deleted',
        component: Deleted,
        props: true
    },
    {
        path: "archived",
        name: 'Archived',
        component: Archived,
        props: true
    },
    {
        path: "import",
        name: 'Import',
        component: Import,
        props: true
    },
    {
        path: "export",
        name: 'export',
        component: Export,
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
        name: 'additem',
        component: CreateContent,
        props: true
    },
    // {
    //     path: ":firstUri",
    //     name: "Item1",
    //     component: Item,
    //     props: true,
    //   },
    {
        path: "/",
        name: 'content',
        component: AllContent,
        props: true
    }
]
