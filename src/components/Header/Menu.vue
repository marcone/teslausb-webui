<template>
    <div>
        <div class="bar">
            <VeuiButton ui="text l" @click.stop="handleMenuButtonClick">
                <VeuiIcon name="hamburger" />
            </VeuiButton>
            <h1>{{ currentTitle }}</h1>
            <slot name="extra" :compact="true" />
        </div>

        <VeuiDrawer title="TeslaUSB" placement="left" :open.sync="openDrawer" outside-closable footless
            overlay-class="header-drawer-overlay">
            <VeuiMenu :items="menuItems" @activate="handleMenuActivate" />
        </VeuiDrawer>
    </div>
</template>

<script>
import 'veui-theme-dls-icons/hamburger';

export default {
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
    watch: {
        compact() {
            this.openDrawer = false;
        }
    },
    methods: {
        handleResize() {
            this.compact = this.$el.offsetWidth < 500;
        },
        handleMenuButtonClick() {
            this.openDrawer = true;
        },
        handleMenuActivate() {
            this.openDrawer = false;
        }
    },
    mounted() {
        this.handleResize();
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
}
h1 {
    margin: 0;
    font-size: 22px;
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
    }
}
</style>
