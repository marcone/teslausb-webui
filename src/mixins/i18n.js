import {template} from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import i18n from '../locale';

dayjs.extend(relativeTime);

function getDayjsLocale(val) {
    return {
        'en-US': 'en',
        'zh-Hans': 'zh-cn'
    }[val];
}

export function formatTimeFromNow(locale, t) {
    return dayjs(t).fromNow();
}

export default {
    methods: {
        t(key, data) {
            const message = i18n.get(`TeslaUSB-${this.$options.name}.${key}`);
            return template(message)(data);
        },
        ft(time) {
            return dayjs(time).locale(getDayjsLocale(i18n.locale)).fromNow();
        }
    }
}
