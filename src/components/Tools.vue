<template>
    <div class="tools">
        <p>
            <VeuiButton ui="primary" :loading="isTriggering" :disabled="disabled"
                @click="handleTriggerButtonClick">Trigger archive/sync</VeuiButton>
        </p>
        <p>
            <VeuiButton ui="basic" :loading="isRebooting" :disabled="disabled"
                @click="handleRebootButtonClick">Restart Raspberry Pi</VeuiButton>
        </p>
    </div>
</template>

<script>
import {triggerArchiveSync, reboot} from '../apis';

export default {
    data() {
        return {
            isTriggering: false,
            isRebooting: false,
        }
    },
    computed: {
        disabled() {
            return this.isTriggering || this.isRebooting;
        }
    },
    methods: {
        async handleTriggerButtonClick() {
            this.isTriggering = true;
            try {
                await triggerArchiveSync();
            } catch (err) {
                this.$toast.error(err.message);
                return;
            } finally {
                this.isTriggering = false;
            }
            this.$toast.success('Sync triggered');
        },
        async handleRebootButtonClick() {
            if (!(await this.$confirm(
                'Are you sure you want to restart the Raspberry Pi?',
                'Restart Raspberry Pi',
                {okLabel: 'Restart'}
            ))) {
                return;
            }
            this.isRebooting = true;
            try {
                await reboot();
            } catch (err) {
                this.$toast.error(err.message);
                return;
            } finally {
                this.isRebooting = false;
            }
            this.$toast.success('Rebooted');
        }
    }
}
</script>

<style scoped>
.tools {
    margin: 0 16px 16px;
}
</style>
