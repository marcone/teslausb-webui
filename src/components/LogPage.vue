<template>
    <LogView class="log-page" v-bind="current" />
</template>

<script>
import i18nMixin from '../mixins/i18n';
import LogView from './LogView';

const typeMap = {
    archiveloop: ['archiveloop-log', 'archiveloop.log'],
    setup: ['setup-log', 'teslausb-headless-setup.log']
};

export default {
    name: 'LogPage',
    components: {LogView},
    mixins: [i18nMixin],
    computed: {
        current() {
            const {category} = this.$route.params;
            const [titleKey, fileName] = typeMap[category];
            return {title: this.t(titleKey), fileName};
        }
    }
}
</script>

<style lang="less" scoped>
.log-page {
    margin: 16px 16px 0;
    height: calc(100vh - 50px - 20px);

    /deep/ .content {
        margin: -1em -1em 0;
        padding: 1em;
    }
}
</style>
