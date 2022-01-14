<template>
    <span>
        <VeuiSelect class="locale-select" :options="options" :value="value"
            :expanded.sync="expanded" @change="$emit('change', $event)" />
        <VeuiButton :ui="ui" @click="expanded = true">
            <slot v-bind="selected">{{selected.label}}</slot>
        </VeuiButton>
    </span>
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        ui: String,
        value: [String, Number],
        options: Array
    },
    data() {
        return {
            expanded: false
        }
    },
    computed: {
        selected() {
            return this.options.find(item => item.value === this.value);
        }
    }
}
</script>

<style lang="less" scoped>
.locale-select {
    width: 0;
    overflow: hidden;
    visibility: hidden;
}
</style>
