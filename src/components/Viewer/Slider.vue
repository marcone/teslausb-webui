<template>
    <VeuiSlider @mousedown.native="handleMousedown"
        :value="localValue"
        :secondary-progress="secondaryProgress"
        @input="localValue = $event"
    >
        <template #tip-label>
            <slot :value="localValue"></slot>
        </template>
    </VeuiSlider>
</template>

<script>
import {once} from './common';

export default {
    props: {
        value: Number,
        secondaryProgress: Number
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
