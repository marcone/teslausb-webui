import {template} from 'lodash';
import i18n, {prefixNs} from '../locale';

export default {
    methods: {
        t(key, data) {
            const message = i18n.get(`${prefixNs(this.$options.name)}.${key}`);
            return template(message)(data);
        }
    }
}
