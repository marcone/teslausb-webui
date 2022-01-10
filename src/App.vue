<template>
    <div id="app" v-resize="handleResize">
        <Header :items="links" />
        <div class="tab-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import {resize} from 'veui';
import i18nMixin from './mixins/i18n';
import "veui-theme-dls/common.less";
import Header from "./components/Header/Index.vue";

const links = [
    ["diagnostics", "/diagnostics"],
    ["archiveloop-log", "/log/archiveloop"],
    ["setup-log", "/log/setup"],
    ["tools", "/tools"],
    ["recordings", "/recordings"],
    ["viewer", "/viewer"],
];

export default {
    name: "AppRoot",
    directives: {
        resize
    },
    components: {
        Header,
    },
    mixins: [i18nMixin],
    data() {
        return {
            compact: false,
        }
    },
    computed: {
        links() {
            return links.map(([key, ...rest]) => {
                return [this.t(key), ...rest];
            });
        }
    },
    methods: {
        handleResize() {
            this.compact = this.$el.offsetWidth < 500;
        }
    },
    mounted() {
        this.handleResize();
    },
    provide() {
        return {
            compact: this.compact,
        }
    }
};
</script>

<style lang="less" scoped>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
