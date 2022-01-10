<template>
    <div class="log-view">
        <div class="bar">
            <div>
                <VeuiLoading :loading="!content" />
                <slot name="buttons" />
                <VeuiButton :disabled="!content" @click="handleDownload">
                    Download {{title}}
                </VeuiButton>
            </div>
            <div class="update-time">{{ updateTime }}</div>
        </div>
        <div class="content">
            <pre>{{content}}</pre>
        </div>
    </div>
</template>

<script>
import {readLiveFile} from '../apis/log';

export default {
    props: {
        title: String,
        fileName: String
    },
    data() {
        return {
            content: undefined,
            updateTime: undefined
        }
    },
    watch: {
        fileName: {
            immediate: true,
            handler() {
                this.refresh();
            }
        }
    },
    methods: {
        refresh() {
            if (this.stop) {
                this.stop();
                this.content = undefined;
                this.updateTime = undefined;
            }
            this.stop = readLiveFile(this.fileName, content => {
                this.content = content;
                this.updateTime = new Date();
            });
        },
        handleDownload() {

        }
    },
    beforeDestroy() {
        this.stop && this.stop();
    }
}
</script>


<style lang="less" scoped>
.bar {
    height: 50px;
    display: flex;
    justify-content: space-between;
}
.content {
    height: calc(100vh - 50px - 50px);
    overflow: auto;
}
.update-time {
    color: gray;
    font-size: 0.8em;
}
</style>