<template>
    <div class="bing-map" v-resize="handleResize">
        <iframe :src="url"></iframe>
    </div>
</template>

<script>
import {resize} from 'veui';

const bingMapParams = {
    lvl: 18,
    typ: 'd',
    sty: 'h',
    src: 'SHELL',
    FORM: 'MBEDV8',
};

export default {
    name: 'BingMap',
    directives: {
        resize
    },
    props: {
        coordinate: Array // lat, lon
    },
    data() {
        return {
            width: 0,
            height: 0,
        }
    },
    computed: {
        url() {
            return 'https://www.bing.com/maps/embed?' + new URLSearchParams({
                ...bingMapParams,
                w: this.width,
                h: this.height,
                cp: this.coordinate.join('~'),
            });
        }
    },
    methods: {
        handleResize() {
            this.width = this.$el.clientWidth;
            this.height = this.$el.clientHeight;
        }
    },
    mounted() {
        this.handleResize();
    }
}
</script>

<style lang="less" scoped>
iframe {
    border: none;
    width: 100%;
    height: 100%;
}
</style>
