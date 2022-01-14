<template>
    <div>
        <VeuiConfigProvider :value="{'overlay.overlayClass': 'viewer-episode-select'}">
            <VeuiSelect class="select" searchable :value="value" :options="nestedOptions"
                :expanded.sync="expanded" @toggle="handleSelectToggle"
                :placeholder="t('episode-select-placeholder')" @change="handleCurrentChange">
                <template #label>
                    <SimpleBreadcrumb :items="currentBreadcrumb" />
                </template>
                <template #option="{matches, label, data}">
                    <span @mouseenter="showTooltip($event, data)" @mouseleave="showTooltip()">
                        <SimpleBreadcrumb v-if="matches" :items="matches" highlight />
                        <template v-else>{{ label }}</template>
                    </span>
                </template>
            </VeuiSelect>
        </VeuiConfigProvider>
        <VeuiTooltip v-if="!compact && currentTooltip" :open="expanded" :target="currentTooltip.target" position="right">
            <img class="viewer-episode-select-popup-thumb" :src="currentTooltip.imgSrc" />
        </VeuiTooltip>

        <VeuiDialog v-if="compact" :open.sync="compactExpanded"
            overlay-class="viewer-compact-episode-select-overlay"
            :title="t('episode-select-placeholder')" footless ui="fullscreen">
            <Collection :value="value" :options="nestedOptions" @change="handleCurrentChange" />
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
            expanded: false,
            compactExpanded: false,
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
                options: convertSequences(sequences, groupName)
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
                    return {label: date, position: 'inline', options};
                });
            }
        },
        currentBreadcrumb() {
            const [group, date, time] = this.value.split('$');
            return [this.t(group), date, time];
        }
    },
    methods: {
        handleCurrentChange(value) {
            if (this.compact) {
                this.compactExpanded = false;
            }
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
        },

        handleSelectToggle(expanded) {
            if (!expanded || !this.compact) {
                return;
            }

            this.expanded = false;
            this.compactExpanded = true;
        }
    }
}
</script>


<style lang="less">
.viewer-episode-select {
    --dls-dropdown-max-display-items: 12;

    .veui-option-group-options {
        padding-top: 0;
        margin-top: 4px;
    }
    .veui-option-group-label {
        position: sticky;
        top: 0;
        background: white;
    }
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
