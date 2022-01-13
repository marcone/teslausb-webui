<template>
    <span :key="key.toString()">{{ format(time) }}</span>
</template>

<script>
import dayjs from 'dayjs';
import i18n from '../locale';

export default {
    props: {
        time: Date,
        relative: Boolean
    },
    data() {
        return {
            key: new Date()
        }
    },
    methods: {
        format(time) {
            const instance = dayjs(time).locale(getDayjsLocale(i18n.locale))
            return this.relative ? instance.fromNow() : instance.format('YYYY-MM-DD HH:mm:ss');
        }
    },
    mounted() {
        if (!this.relative) {
            return;
        }
        this.timer = setInterval(() => {
            this.key = new Date();
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
}

function getDayjsLocale(val) {
    return {
        'en-US': 'en',
        'zh-Hans': 'zh-cn'
    }[val];
}
</script>
