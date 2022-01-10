<template>
    <div>
        <VeuiSelect searchable :value="current" @change="handleCurrentChange">
            <VeuiOptionGroup label="RecentClips" :options="groups.recent" position="popup" />
            <VeuiOptionGroup label="SavedClips" :options="groups.saved" position="popup" />
            <VeuiOptionGroup label="SentryClips" :options="groups.sentry" position="popup" />
        </VeuiSelect>
    </div>
</template>

<script>
export default {
    inject: ['compact'], // TODO: ui for mobile
    props: {
        value: String,
        videos: Object
    },
    computed: {
        groups() {
            return {}
        }
    },
    methods: {
        handleCurrentChange(value) {
            this.$emit('input', value);
        }
    }
}
</script>
