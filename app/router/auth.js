import Login from '@/views/auth/Login';
import Logout from '@/views/auth/Logout';
import Reset from '@/views/auth/Reset';
import Confirm from '@/views/auth/Confirm';


export default [
    {
        path: "login",
        name: 'login',
        component: Login
    },
    {
        path: "logout",
        name: 'logout',
        component: Logout
    },
    {
        path: "reset",
        name: 'reset',
        component: Reset
    },
    {
        path: "confirm",
        name: 'confirm',
        component: Confirm
    },
]
