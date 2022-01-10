<template>
    <div>
        <div class="bar">
            <VeuiButton ui="text l" @click.stop="handleMenuButtonClick">
                <VeuiIcon name="hamburger" />
            </VeuiButton>
            <h1>{{ currentTitle }}</h1>
            <div>
                <slot name="extra" :compact="true" />
            </div>
        </div>

        <VeuiDrawer title="TeslaUSB" placement="left" :open.sync="openDrawer" outside-closable footless
            overlay-class="header-drawer-overlay">
            <VeuiMenu class="links" :items="menuItems" @activate="handleMenuActivate" />
            <div class="locale-select">
                <Locale />
            </div>
        </VeuiDrawer>
    </div>
</template>

<script>
import 'veui-theme-dls-icons/hamburger';
import Locale from './Locale.vue';

export default {
    components: {
        Locale,
    },
    props: {
        items: Array
    },
    data() {
        return {
            openDrawer: false,
            active: null
        }
    },
    computed: {
        currentTitle() {
            return this.items.find(([, to]) => to === this.$route.path)?.[0];
        },
        menuItems() {
            return this.items.map(([label, to]) => ({label, to}));
        }
    },
    methods: {
        handleMenuButtonClick() {
            this.openDrawer = true;
        },
        handleMenuActivate() {
            this.openDrawer = false;
        }
    }
}
</script>

<style lang="less" scoped>
.bar {
    height: 44px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d3d9e6;

    h1 {
        margin: 0;
        font-size: 18px;
    }
}

.links {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: scroll;
}
.locale-select {
    flex: 0 0 auto;
    margin: 8px 10px 0;
}
</style>

<style lang="less">
.header-drawer-overlay {
    .veui-dialog-content {
        width: 200px;
    }
    .veui-dialog-content-body {
        padding: 4px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
}
</style>
