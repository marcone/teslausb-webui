<template>
    <div class="diagnostics">
        <VeuiLoading :loading="!triggered" />
        <LogView v-if="triggered" title="Diagnostics" fileName="diagnostics.txt">
            <template #buttons>
                <VeuiButton @click="refresh">Refresh Diagnostics</VeuiButton>
            </template>
        </LogView>
    </div>
</template>

<script>
import LogView from './LogView';

export default {
    components: {LogView},
    data() {
        return {
            triggered: false
        };
    },
    methods: {
        async refresh() {
            this.triggered = false;
            await callCgi('cgi-bin/diagnose.sh', 'generate diagnostics');
            this.triggered = true;
        }
    },
    mounted() {
        this.refresh();
    }
}
</script>
