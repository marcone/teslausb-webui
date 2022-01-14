<template>
    <div class="collection">
        <div class="tab">
            <veui-radio-button-group v-model="current" :items="buttons" />
        </div>

        <div class="day-group" v-for="({label, options}) in days" :key="label">
            <div class="day-title">{{ label }}</div>
            <div class="day-items">
                <div v-for="({label, value, data}) in options" :key="value"
                    class="day-item" :class="{'active': isActive(value)}"
                    @click="$emit('change', value)" tabindex="-1">
                    <div class="thumb" :class="{placeholder: !data.thumb}">
                        <img v-if="data.thumb" :src="getThumbSrc(data)" />
                        <VeuiIcon v-else name="video" />
                    </div>
                    <div class="label">{{ label }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'veui-theme-dls-icons/video';
import {getVideoURL} from '@/apis/video';

export default {
    inject: ['t'],
    props: {
        value: String,
        options: Array
    },
    data() {
        const defaultCurrent = this.options.findIndex(({label}) => this.value.startsWith(label));
        return {
            current: defaultCurrent < 0 ? 0 : defaultCurrent,
        }
    },
    computed: {
        buttons() {
            return this.options.map(({label}, value) => ({label: this.t(label), value}));
        },
        days() {
            return this.options[this.current].options;
        }
    },
    methods: {
        isActive(val) {
            return this.value === val;
        },
        getThumbSrc({group, sequence, thumb}) {
            return getVideoURL(group, sequence, thumb);
        }
    }
}
</script>

<style lang="less" scoped>
.tab {
    margin: 0 -20px;
    padding: 0 20px;
    background: white;
    position: sticky;
    z-index: 2;
    top: 0;
}
.day-title {
    margin: 0 -20px;
    padding: 1em 20px 0.3em;
    background: white;
    position: sticky;
    z-index: 1;
    top: 32px;
    font-size: 1.2em;
    font-weight: bold;
}
.day-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
}
</style>
