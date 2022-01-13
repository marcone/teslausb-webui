import Viewer from './components/Viewer/Index.vue';
import Diagnostics from './components/Diagnostics';
import LogPage from './components/LogPage';
import Tools from './components/Tools';
import Recordings from './components/Recordings';
import Debug from './components/Debug';

const routes = [
    {
        path: '/diagnostics',
        component: Diagnostics,
    },
    {
        path: '/log/:category',
        component: LogPage,
    },
    {
        path: '/tools',
        component: Tools,
    },
    {
        path: '/recordings',
        component: Recordings,
    },
    {
        path: '/viewer',
        component: Viewer,
    },
];

if (process.env.NODE_ENV === 'development') {
    routes.push({
        path: '/debug',
        component: Debug,
    });
}

export default routes;
