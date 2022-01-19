<template>
    <div class="header">
        <component :is="component" :items="items">
            <template #extra="{compact}">
                <VeuiLink class="link" target="_self" native to="/"
                    v-if="showBackToLegacyButton" v-tooltip.reverse="t('back-to-legacy')">
                    <VeuiIcon name="undo" />
                </VeuiLink>
                <VeuiLink class="link github" ui="strong" target="_blank" native to="https://github.com/marcone/teslausb">
                    <VeuiIcon name="github" />
                    <strong v-if="!compact">TeslaUSB</strong>
                </VeuiLink>
            </template>
        </component>
    </div>
</template>

<script>
import {tooltip} from 'veui';
import 'veui-theme-dls-icons/undo';
import {Icon} from 'veui';
import Menu from './Menu';
import Tabs from './Tabs';
import i18nMixin from '../../mixins/i18n';

Icon.register({
    github: {
        width: 32,
        height: 32,
        d: 'M16.29,0a16.29,16.29,0,0,0-5.15,31.75c.82.15,1.11-.36,1.11-.79s0-1.41,0-2.77C7.7,29.18,6.74,26,6.74,26a4.36,4.36,0,0,0-1.81-2.39c-1.47-1,.12-1,.12-1a3.43,3.43,0,0,1,2.49,1.68,3.48,3.48,0,0,0,4.74,1.36,3.46,3.46,0,0,1,1-2.18c-3.62-.41-7.42-1.81-7.42-8a6.3,6.3,0,0,1,1.67-4.37,5.94,5.94,0,0,1,.16-4.31s1.37-.44,4.48,1.67a15.41,15.41,0,0,1,8.16,0c3.11-2.11,4.47-1.67,4.47-1.67A5.91,5.91,0,0,1,25,11.07a6.3,6.3,0,0,1,1.67,4.37c0,6.26-3.81,7.63-7.44,8a3.85,3.85,0,0,1,1.11,3c0,2.18,0,3.94,0,4.47s.29.94,1.12.78A16.29,16.29,0,0,0,16.29,0Z'
    }
});

export default {
    name: 'Header',
    inject: ['env'],
    directives: {tooltip},
    mixins: [i18nMixin],
    props: {
        items: Array
    },
    computed: {
        component() {
            return this.env.compact ? Menu : Tabs;
        },
        showBackToLegacyButton() {
            return this.env.source === 'legacy';
        }
    }
}
</script>

<style lang="less" scoped>
.link {
    margin-left: 1em;

    &.github {
        font-size: 1.1em;

        strong {
            margin-left: 5px;
        }

        &:hover {
            /deep/ path {
                fill: currentColor;
            }
        }
    }
}
</style>
