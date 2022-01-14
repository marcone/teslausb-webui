<template>
    <span>
        <Dropdown v-if="compact" ui="text xl" v-bind="props" @change="setLocale">
            <template v-slot="{short}">{{short}}</template>
        </Dropdown>
        <VeuiSelect v-else class="select" v-bind="props" @change="setLocale" />
    </span>
</template>

<script>
import i18n, {setLocale, availableLocales} from '@/locale';
import Dropdown from '../Dropdown.vue';

export default {
    components: {Dropdown},
    props: {
        compact: Boolean,
    },
    computed: {
        props() {
            return {
                value: i18n.locale,
                options: availableLocales
            };
        }
    },
    methods: {
        setLocale
    }
}
</script>

<style lang="less" scoped>
.select {
    width: 100%;
}
</style>
