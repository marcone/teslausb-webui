<template>
    <div class="diagnostics">
        <div class="loading">
            <VeuiLoading ui="l" :loading="!triggered">{{ t('generating') }}</VeuiLoading>
        </div>
        <LogView v-if="triggered" :title="t('diagnostics')" fileName="diagnostics.txt">
            <template #buttons="loading">
                <VeuiButton @click="refresh" :disabled="loading">Refresh Diagnostics</VeuiButton>
            </template>
        </LogView>
    </div>
</template>

<script>
import i18nMixin from '../mixins/i18n';
import {callCgi} from '../apis/common';
import LogView from './LogView';

export default {
    name: 'DiagnosticsPage',
    components: {LogView},
    mixins: [i18nMixin],
    data() {
        return {
            triggered: false
        };
    },
    methods: {
        async refresh() {
            this.triggered = false;
            try {
                await callCgi('cgi-bin/diagnose.sh', 'generate diagnostics');
                this.triggered = true;
            }
            catch (e) {
                this.$toast.error(e.message);
            }
        }
    },
    mounted() {
        this.refresh();
    }
}
</script>

<style lang="less" scoped>
.diagnostics {
    margin: 16px 16px 0;
    height: calc(100vh - 50px - 20px);

    /deep/ .log-view .content {
        margin: -1em -1em 0;
        padding: 1em;
    }
}
</style>
