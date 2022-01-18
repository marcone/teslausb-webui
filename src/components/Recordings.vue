<template>
    <div class="recordings">
        <div class="loading" v-if="loading">
            <VeuiLoading loading ui="vertical l strong" />
        </div>
        <iframe src="/TeslaCam/" @load="handleFrameLoad"></iframe>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },
    methods: {
        handleFrameLoad({target: iframe}) {
            this.loading = false;

            if (iframe.contentWindow.location.pathname === '/TeslaCam/') {
                setTimeout(() => {
                    const doc = iframe.contentDocument;
                    const link = doc.querySelector('#list tbody tr');
                    // remove link to parent folder if current page is the root
                    link.parentElement.removeChild(link);
                });
            }
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
