<template>
    <div class="slider">
        <VeuiSlider @mousedown.native="handleMousedown"
            :value="localValue"
            :secondary-progress="secondaryProgress"
            @input="localValue = $event"
        >
            <template #tip-label>
                <slot :value="localValue"></slot>
            </template>
        </VeuiSlider>
        <div v-if="hotPoint" class="hot-point" :style="{left: hotPoint * 100 + '%'}"></div>
    </div>
</template>

<script>
import {once} from '../helper';

export default {
    props: {
        value: Number,
        secondaryProgress: Number,
        hotPoint: Number
    },
    data() {
        return {
            localValue: this.value,
            dragging: false
        };
    },
    watch: {
        value(val) {
            if (!this.dragging) {
                this.localValue = val;
            }
        }
    },
    methods: {
        handleMousedown() {
            this.dragging = true;
            once(document, 'mouseup', () => {
                this.dragging = false;
                setTimeout(() => {
                    this.$emit('change', this.localValue)
                }, 0);
            });
        }
    }
}
</script>

<style lang="less" scoped>
.slider {
    position: relative;

    /deep/ .veui-slider-thumb {
        z-index: 1;
    }
}
.hot-point {
    position: absolute;
    top: 9px;
    width: 8px;
    height: 8px;
    margin: -4px -4px;
    border-radius: 100%;
    background: red;
    pointer-events: none;
}
</style>
