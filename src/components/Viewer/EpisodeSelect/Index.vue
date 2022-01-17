<template>
    <div>
        <VeuiConfigProvider :value="{'overlay.overlayClass': 'viewer-episode-select'}">
            <VeuiDropdown class="select" trigger="hover" :split="!compact"
                :options="nestedOptions"
                :expanded.sync="dropdownExpanded"
                @click="handleDropdownClick"
                @toggle="handleDropdownToggle"
            >
                <template #label>
                    <VeuiBreadcrumb :routes="currentBreadcrumb" />
                </template>
                <template #option="{label, data}">
                    <span @mouseenter="showTooltip($event, data)" @mouseleave="showTooltip()">
                        {{ label }}
                    </span>
                </template>
            </VeuiDropdown>
        </VeuiConfigProvider>
        <VeuiTooltip v-if="!compact && currentTooltip" :open="dropdownExpanded" :target="currentTooltip.target" position="right">
            <img class="viewer-episode-select-popup-thumb" :src="currentTooltip.imgSrc" />
        </VeuiTooltip>

        <VeuiDialog :open.sync="dialogOpen"
            overlay-class="viewer-compact-episode-select-overlay"
            :title="t('episode-select-placeholder')" footless :ui="compact ? 'fullscreen' : 'wide'">
            <Collection :compact="compact" :value="value" :options="nestedOptions" @change="handleCurrentChange" />
        </VeuiDialog>
    </div>
</template>

<script>
import {getVideoURL} from '@/apis/video';
import Collection from './Collection.vue';

export default {
    components: {Collection},
    inject: ['env', 't'],
    props: {
        value: String,
        videos: Object
    },
    data() {
        return {
            dropdownExpanded: false,
            dialogOpen: false,
            currentTooltip: undefined,
        }
    },
    computed: {
        compact() {
            return this.env.compact;
        },
        nestedOptions() {
            return Object.entries(this.videos).map(([groupName, sequences]) => ({
                label: this.t(groupName),
                trigger: 'hover',
                position: 'popup',
                options: convertSequences(sequences, groupName).reverse()
            }));

            function convertSequences(sequences, groupName) {
                return Object.entries(sequences).map(function ([date, times]) {
                    const options = Object.entries(times).map(function ([time, data]) {
                        return {
                            label: time,
                            value: [groupName, date, time].join('$'),
                            data,
                        };
                    });
                    return {
                        label: date,
                        trigger: 'hover',
                        position: 'popup',
                        options
                    };
                });
            }
        },
        currentBreadcrumb() {
            const [group, date, time] = this.value.split('$');
            return [this.t(group), date, time].map(label => ({label}));
        }
    },
    methods: {
        handleDropdownClick(value) {
            if (!value) {
                this.dialogOpen = true;
                return;
            }
            this.handleCurrentChange(value);
        },
        handleDropdownToggle(expanded) {
            if (this.compact) {
                this.dropdownExpanded = false;
                this.dialogOpen = true;
            }
        },
        handleCurrentChange(value) {
            this.dialogOpen = false;
            this.$emit('input', value);
        },
        showTooltip(event, data) {
            if (!data) {
                this.currentTooltip = undefined;
                return;
            }
            const {group, sequence, thumb} = data;
            const imgSrc = getVideoURL(group, sequence, thumb);
            this.currentTooltip = thumb && {target: event.target, imgSrc};
        }
    }
}
</script>


<style lang="less">
.viewer-episode-select {
    --dls-dropdown-max-display-items: 15;
}
.viewer-episode-select-popup-thumb {
    display: block;
    max-width: 500px;
}

.viewer-compact-episode-select-overlay {
    .veui-dialog-content-body {
        padding-top: 0;
    }
}
</style>
