import Viewer from './components/Viewer';
import Diagnostics from './components/Diagnostics';
import Log from './components/Log';
import Tools from './components/Tools';
import Recordings from './components/Recordings';

export default [
    {
        path: '/diagnostics',
        component: Diagnostics,
    },
    {
        path: '/log/:category',
        component: Log,
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
