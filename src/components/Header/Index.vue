<template>
    <div class="header" v-resize="handleResize">
        <component :is="component" :items="items">
            <template #extra="{compact}">
                <VeuiLink ui="strong s" target="_blank" to="https://github.com/marcone/teslausb">
                    {{ compact ? 'GitHub' : 'TeslaUSB on GitHub' }}
                </VeuiLink>
            </template>
        </component>
    </div>
</template>

<script>
import {resize} from 'veui';
import Menu from './Menu';
import Tabs from './Tabs';

export default {
    directives: {
        resize
    },
    props: {
        items: Array
    },
    data() {
        return {
            compact: false,
        }
    },
    computed: {
        component() {
            return this.compact ? Menu : Tabs;
        }
    },
    methods: {
        handleResize() {
            this.compact = this.$el.offsetWidth < 500;
        }
    },
    mounted() {
        this.handleResize();
    }
}
</script>
