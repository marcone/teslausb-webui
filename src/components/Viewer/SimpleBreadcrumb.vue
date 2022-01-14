<template>
    <span class="breadcrumb">
        <template v-for="(item, i) in items">
            <span class="breadcrumb-joint" v-if="i" :key="'j' + i">
                <VeuiIcon name="chevron-right" />
            </span>
            <span class="breadcrumb-item" :key="'i' + i">
                <template v-if="highlight">
                    <template v-for="({text, matched}, j) in item.parts">
                        <component :is="matched ? 'mark' : 'span'" :key="j"
                            :class="{'veui-option-matched': matched}">{{text}}</component>
                    </template>
                </template>
                <template v-else>
                    {{ item }}
                </template>
            </span>
        </template>
    </span>
</template>

<script>
import 'veui-theme-dls-icons/chevron-right';

export default {
    props: {
        items: Array,
        highlight: Boolean
    }
}
</script>

<style lang="less" scoped>
.breadcrumb {

    &-joint {
        margin: 0 0.3em;
        font-size: 0.8em;
        color: gray;
    }

    &-item {

        &:last-child {
            font-weight: bold;
        }
    }
}
</style>
