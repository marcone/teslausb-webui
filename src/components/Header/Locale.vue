<template>
    <span :class="{compact}">
        <VeuiButton v-if="compact" ui="primary square s" @click="handleLocaleClick">{{shortLabel}}</VeuiButton>
        <VeuiSelect class="locale-select" :options="availableLocales" :value="currentLocale"
            :expanded.sync="localeExpanded" @change="handleLocaleChange" />
    </span>
</template>

<script>
import i18n, {availableLocales} from '@/locale';

export default {
    props: {
        compact: Boolean,
    },
    data() {
        return {
            availableLocales,
            localeExpanded: false
        }
    },
    computed: {
        currentLocale() {
            return i18n.locale;
        },
        shortLabel() {
            return availableLocales.find(item => item.value === this.currentLocale).short;
        }
    },
    methods: {
        handleLocaleClick() {
            this.localeExpanded = true;
        },
        handleLocaleChange(val) {
            i18n.locale = val;

            const {pathname, search, hash} = location;
            const query = new URLSearchParams(search);
            query.set('locale', val);
            history.replaceState(null, '', `${pathname}?${query.toString()}${hash}`);
        }
    }
}
</script>

<style lang="less" scoped>
.locale-select {
    width: 100%;
}

.compact {
    .locale-select {
        width: 1px;
        overflow: hidden;
        visibility: hidden;
    }
}
</style>
