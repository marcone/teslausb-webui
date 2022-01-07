import Vue from 'vue';
import VueRouter from 'vue-router';
import confirm from 'veui/plugins/confirm';
import toast from 'veui/plugins/toast';
import App from './App.vue';
import routes from './routes';

Vue.config.productionTip = false;
Vue.use(confirm);
Vue.use(toast);
Vue.use(VueRouter);

const router = new VueRouter({ routes });
router.beforeEach(function (to, from, next) {
    if (to.path === '/') {
        next({ path: '/viewer' });
    }
    next();
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
