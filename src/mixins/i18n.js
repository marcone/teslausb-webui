import i18n, {prefixNs} from '../locale';

export default {
    methods: {
        t(key, data) {
            return i18n.get(`${prefixNs(this.$options.name)}.${key}`, data);
        }
    }
}
