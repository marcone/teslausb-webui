import Viewer from './components/Viewer';
import Diagnostics from './components/Diagnostics';
import Log from './components/Log';
// import Tools from './components/Tools';

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
        component: Diagnostics,
    },
    {
        path: '/viewer',
        component: Viewer,
    },
]
