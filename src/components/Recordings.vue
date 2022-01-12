<template>
    <div class="recordings">
        <div class="loading" v-if="loading">
            <VeuiLoading loading ui="vertical l strong" />
        </div>
        <iframe src="/TeslaCam/" @load="loading = false"></iframe>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },
    mounted() {
        this.loading = true;
    }
}
</script>


<style lang="less" scoped>
.recordings {
    position: relative;

    .loading {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    iframe {
        width: 100%;
        height: calc(100vh - 50px);
        border: none;
    }
}
</style>
