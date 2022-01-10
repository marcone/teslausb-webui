<template>
    <div class="header">
        <component :is="component" :items="items">
            <template #extra="{compact}">
                <VeuiLink class="github-link" ui="strong s" target="_blank" to="https://github.com/marcone/teslausb">
                    <template v-if="compact">GitHub</template>
                    <template v-else>
                        <big><strong>TeslaUSB</strong></big> on GitHub
                    </template>
                </VeuiLink>
            </template>
        </component>
    </div>
</template>

<script>
import Menu from './Menu';
import Tabs from './Tabs';

export default {
    props: {
        compact: Boolean,
        items: Array
    },
    computed: {
        component() {
            return this.compact ? Menu : Tabs;
        }
    }
}
</script>

<style lang="less" scoped>
.github-link {
    margin-left: 1em;
}
</style>
