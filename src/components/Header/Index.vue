<template>
    <div class="header" v-resize="handleResize">
        <component :is="component" :items="items">
            <template #extra="{compact}">
                <VeuiLink class="github-link" ui="strong s" target="_blank" to="https://github.com/marcone/teslausb">
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

const locales = [
    {
        label: 'English',
        value: 'en-US',
        short: 'EN',
    },
    {
        label: '简体中文',
        value: 'zh-Hans',
        short: '简'
    }
];

export default {
    directives: {
        resize
    },
    props: {
        items: Array
    },
    data() {
        return {
            locales,
            localeExpanded: false,
            compact: false,
        }
    },
    computed: {
        currentLocale() {
            return i18n.locale;
        },
        component() {
            return this.compact ? Menu : Tabs;
        }
    },
    methods: {
        handleResize() {
            this.compact = this.$el.offsetWidth < 500;
        },
        handleLocaleClick() {
            this.localeExpanded = true;
        },
        handleLocaleChange(val) {
            i18n.locale = val;
        }
    },
    mounted() {
        this.handleResize();
    }
}
</script>

<style lang="less" scoped>
.github-link {
    margin-left: 1em;
}
</style>
