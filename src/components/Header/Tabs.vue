<template>
    <VeuiTabs>
        <template v-for="([label, to]) in items">
            <VeuiTab :label="label" :name="label" :to="to" :key="to" />
        </template>
        <template #extra>
            <div class="extra">
                <slot name="extra" :compact="false" />
                <Locale class="locale-button" compact />
            </div>
        </template>
    </VeuiTabs>
</template>

<script>
import Locale from './Locale.vue';

export default {
    components: {
        Locale,
    },
    props: {
        items: Array
    }
}
</script>

<style lang="less" scoped>
.extra {
    width: 100%;
    padding-right: 16px;
    text-align: right;
}

.locale-button {
    margin-left: 1em;
}
</style>
