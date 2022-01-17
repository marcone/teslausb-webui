<template>
    <div class="collection">
        <div class="tab">
            <VeuiRadioButtonGroup v-model="current" :items="buttons" />
            <VeuiDatePicker v-if="!compact" v-model="dateRange" range clearable :shortcuts="datePickerShortcuts" />
        </div>

        <div class="day-group" v-for="({label, options}) in days" :key="label">
            <div class="day-title">{{ label }}</div>
            <div class="day-items">
                <div v-for="({label, value, data}) in options" :key="value"
                    class="day-item" :class="{'active': isActive(value)}" :data-value="value"
                    @click="$emit('change', value)" tabindex="-1">
                    <div class="thumb" :class="{placeholder: !data.thumb}">
                        <img v-if="data.thumb" :src="getThumbSrc(data)" />
                        <VeuiIcon v-else name="video" />
                    </div>
                    <div class="label">{{ label }}</div>
                </div>
            </div>
        </div>

        <VeuiAlert type="info" v-if="days.length === 0" class="empty">
            <template v-if="dateRange">{{ t('no-video-found-in-range') }}</template>
            <template v-else>{{ t('no-video-found') }}</template>
        </VeuiAlert>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import 'veui-theme-dls-icons/video';
import {getVideoURL} from '@/apis/video';

const datePickerShortcuts = [
    {
        label: 'thisMonth',
        from: {
            startOf: 'month'
        },
        to: 0
    },
    {
        label: 'thisWeek',
        from: {
            startOf: 'week',
            days: 0
        },
        to: 0
    },
    {
        label: 'last7days',
        from: -6,
        to: 0
    },
    {
        label: 'today',
        to: 0
    }
];

export default {
    inject: ['t'],
    props: {
        value: String,
        options: Array,
        compact: Boolean
    },
    data() {
        const defaultCurrent = this.options.findIndex(({label}) => this.value.startsWith(label));
        return {
            dateRange: undefined,
            current: defaultCurrent < 0 ? 0 : defaultCurrent,
        }
    },
    computed: {
        datePickerShortcuts() {
            return datePickerShortcuts.map(({label, ...rest}) => ({
                label: this.t(label),
                ...rest
            }));
        },
        buttons() {
            return this.options.map(({label}, value) => ({label: this.t(label), value}));
        },
        days() {
            const options = this.options[this.current].options;
            if (!this.dateRange) {
                return options;
            }
            const [start, end] = this.dateRange;
            return options.filter(({options: [{data: {date}}]}) =>
                dayjs(date).isBetween(start, dayjs(end).add(1, 'day'), null, '[)'));
        }
    },
    methods: {
        isActive(val) {
            return this.value === val;
        },
        getThumbSrc({group, sequence, thumb}) {
            return getVideoURL(group, sequence, thumb);
        }
    },
    mounted() {
        setTimeout(() => {
            this.$el.querySelector(`[data-value="${this.value}"]`).scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }, 100);
    }
}
</script>

<style lang="less" scoped>
.collection {
    min-height: 300px;
}
.empty {
    margin-top: 3em;
}
.tab {
    margin: 0 -20px;
    padding: 5px 20px;
    background: white;
    position: sticky;
    z-index: 2;
    top: 0;
    display: flex;
    justify-content: space-between;
}
.day-title {
    margin: 0 -20px;
    padding: 6px 20px 0;
    background: white;
    position: sticky;
    z-index: 1;
    top: 32px;
    font-size: 1.2em;
    font-weight: bold;
}
.day-items {
    margin: 10px 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
}
.day-item {
    position: relative;
    text-align: center;

    .thumb {
        aspect-ratio: 4 / 3;

        img {
            width: 100%;
        }
    }

    .placeholder {
        border: 1px solid #aaa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
    }

    &.active {
        color: #0052cc;
        .thumb {
            border: 1px solid #0052cc;
            background-color: #f2f7ff;
        }
    }

    &:hover {
        .thumb {
            background-color: #f2f7ff;
        }
    }
}
</style>
