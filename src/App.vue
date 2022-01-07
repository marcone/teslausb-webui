<template>
    <div id="app">
        <Header :items="links" />
        <div class="tab-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import "veui-theme-dls/common.less";
import Header from "./components/Header/Index.vue";

const links = [
    ["Diagnostics", "/diagnostics"],
    ["Archiveloop log", "/log/archiveloop"],
    ["Setup log", "/log/setup"],
    ["Tools", "/tools"],
    ["Recordings", "/recordings"],
    ["Viewer", "/viewer"],
];

export default {
    name: "App",
    components: {
        Header,
    },
    data() {
        return {
            links,
        };
    },
};
</script>

<style lang="less" scoped>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
