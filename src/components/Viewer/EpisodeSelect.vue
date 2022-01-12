<template>
    <div>
        <VeuiConfigProvider :value="{'overlay.overlayClass': 'viewer-episode-select'}">
            <VeuiSelect class="select" searchable :value="value" :options="nestedOptions"
                :placeholder="t('episode-select-placeholder')" @change="handleCurrentChange">
                <template #label>
                    <VeuiBreadcrumb :routes="currentBreadcrumb" />
                </template>
                <template #option="{matches, label, data}">
                    <span @mouseenter="showTooltip($event, data)" @mouseleave="showTooltip()">
                        <template v-if="matches">
                            <VeuiBreadcrumb class="option-label-content">
                                <template v-for="({parts}, i) in matches">
                                    <VeuiBreadcrumbItem :key="i">
                                        <template v-for="({text, matched}, j) in parts">
                                            <component :is="matched ? 'mark' : 'span'" :key="j"
                                                :class="{'veui-option-matched': matched}">{{text}}</component>
                                        </template>
                                    </VeuiBreadcrumbItem>
                                </template>
                            </VeuiBreadcrumb>
                        </template>
                        <template v-else>{{ label }}</template>
                    </span>
                </template>
            </VeuiSelect>
        </VeuiConfigProvider>
        <VeuiTooltip v-if="currentTooltip" open :target="currentTooltip[0]" position="right">
            <img class="viewer-episode-select-popup-thumb" :src="currentTooltip[1]" />
        </VeuiTooltip>
    </div>
</template>

<script>
import {getVideoURL} from '@/apis/video';

export default {
    inject: ['compact', 't'],
    props: {
        value: Array,
        videos: Object
    },
    data() {
        return {
            currentTooltip: undefined,
        }
    },
    computed: {
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
                            value: [groupName, date, time],
                            data,
                        };
                    });
                    return {label: date, position: 'inline', options};
                });
            }
        },
        currentBreadcrumb() {
            const [group, date, time] = this.value;
            return [this.t(group), date, time].map(label => ({label}));
        }
    },
    methods: {
        handleCurrentChange(value) {
            this.$emit('input', value);
        },
        showTooltip(event, data) {
            if (!data) {
                this.currentTooltip = undefined;
                return;
            }
            const {group, sequence, thumb} = data;
            const url = getVideoURL(group, sequence, thumb);
            this.currentTooltip = [event.target, url];
        }
    }
}
</script>

<style lang="less" scoped>
.option-label-content {
    position: relative;
    &::after {
        content: '';
        position: absolute;
        inset: 0;
    }
}
</style>

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
    max-width: 300px;
}
</style>
