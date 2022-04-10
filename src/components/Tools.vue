<template>
    <div class="tools">
        <PiStatus />
        <p class="primary-button-row">
            <VeuiButton ui="primary" :loading="isTriggering" :disabled="disabled"
                @click="handleTriggerButtonClick">{{ t('trigger-sync') }}</VeuiButton>
        </p>
        <p>
            <VeuiButton ui="basic" :loading="isRebooting" :disabled="disabled"
                @click="handleRebootButtonClick">{{ t('reboot-raspi') }}</VeuiButton>
        </p>
    </div>
</template>

<script>
import i18nMixin from '../mixins/i18n';
import {triggerArchiveSync, reboot} from '../apis/device';

export default {
    name: 'Tools',
    mixins: [i18nMixin],
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
            this.$toast.success(this.t('trigger-success'));
        },
        async handleRebootButtonClick() {
            if (!(await this.$confirm(
                this.t('reboot-confirm-content'),
                this.t('reboot-confirm-title'),
                {okLabel: this.t('reboot-confirm-ok-label')}
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
            this.$toast.success(this.t('reboot-success'));
        }
    }
}
</script>

<style scoped>
.tools {
    margin: 16px;
}
.primary-button-row {
    margin-top: 3em;
}
</style>
