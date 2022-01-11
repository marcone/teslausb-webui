<template>
    <span :class="{compact}">
        <VeuiButton v-if="compact" ui="text xl" @click="handleLocaleClick">{{shortLabel}}</VeuiButton>
        <VeuiSelect class="locale-select" :options="availableLocales" :value="currentLocale"
            :expanded.sync="localeExpanded" @change="setLocale" />
    </span>
</template>

<script>
import i18n, {setLocale, availableLocales} from '@/locale';

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
        setLocale,
        handleLocaleClick() {
            this.localeExpanded = true;
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
