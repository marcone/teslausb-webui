import Viewer from './components/Viewer/Index.vue';
import Diagnostics from './components/Diagnostics';
import LogPage from './components/LogPage';
import Tools from './components/Tools';
import Recordings from './components/Recordings';

export default [
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
]
