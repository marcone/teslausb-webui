<template>
    <div>
        <VeuiSelect class="select" searchable :value="value" :options="nestedOptions"
            :placeholder="t('episode-select-placeholder')" @change="handleCurrentChange">
            <template #label>
                <VeuiBreadcrumb :routes="currentBreadcrumb" />
            </template>
            <template #option-label="{matches, label, data}">
                <span v-tooltip="getPopupProps(data)">
                    <template v-if="matches">
                        <template v-for="({text, matched}, i) in matches[0].parts">
                            <component :is="matched ? 'mark' : 'span'" :key="i"
                                :class="{'veui-option-matched': matched}">{{text}}</component>
                        </template>
                    </template>
                    <template v-else>{{ label }}</template>
                </span>
            </template>
        </VeuiSelect>
    </div>
</template>

<script>
import {tooltip} from 'veui';
import {getVideoURL} from '@/apis/video';

export default {
    directives: {tooltip},
    inject: ['compact', 't'],
    props: {
        value: String,
        videos: Array
    },
    computed: {
        nestedOptions() {
            return Object.entries(this.videos).map(([groupName, sequences]) => ({
                label: this.t(groupName),
                trigger: 'hover',
                position: 'popup',
                options: convertSequences(sequences, groupName)
            })).map(options => ({options}));

            function convertSequences(sequences, groupName) {
                const dateGroup = Object.entries(sequences).reduce((dateGroup, [sequenceName, data]) => {
                    const [key, name] = parseSequenceName(sequenceName);
                    if (!dateGroup[key]) {
                        dateGroup[key] = [];
                    }
                    dateGroup[key].push({
                        label: name,
                        value: [groupName, sequenceName],
                        data: {...data, group: groupName, sequence: sequenceName}
                    });
                    return dateGroup;
                }, {});
                return Object.entries(dateGroup).map(([key, options]) => ({
                    label: key,
                    position: 'inline',
                    options
                }));
            }
        },
        currentBreadcrumb() {
            const [group, seq] = this.value;
            const {key} = this.videos[group][seq];
            return [group, ...(key.split('_'))].map(label => ({label}));
        }
    },
    methods: {
        handleCurrentChange(value) {
            this.$emit('input', value);
        },
        getPopupProps({group, sequence, thumb}) {
            const url = getVideoURL(group, sequence, thumb);
            return {
                content: <img className="popup-thumb" src={url} />,
                position: 'right',
                disabled: !thumb
            };
        }
    }
}

function parseSequenceName(name) {
    return [name.substring(0, 14), name.substring(15, 19)];
}
</script>

<style lang="less" scoped>
.popup-thumb {
    display: block;
    width: 300px;
}
.select {
    width: auto;
}
</style>
