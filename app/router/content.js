import Content from '@/views/site/content/Content';
import MyContent from '@/views/site/content/MyContent';
import AllContent from '@/views/site/content/AllContent';

export default [
    {
        path: "mycontent",
        name: 'mycontent',
        component: MyContent,
        props: true
    },
    {
        path: "all",
        name: 'allcontent',
        component: AllContent,
        props: true
    },
    {
        path: "/",
        name: 'content',
        component: Content,
        props: true
    }
]
