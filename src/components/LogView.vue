<template>
    <div class="log-view">
        <div class="bar">
            <div>
                <slot name="buttons" :loading="!content" />
                <VeuiButton ui="s" :disabled="!content" @click="handleDownload">
                    {{ t('download', {title}) }}
                </VeuiButton>
            </div>
            <div class="update-time">
                <LiveTime relative :time="updateTime" />
            </div>
        </div>
        <div class="content">
            <VeuiLoading :loading="!content">{{ t('loading') }}</VeuiLoading>
            <pre>{{content}}</pre>
        </div>
    </div>
</template>

<script>
import {saveAs} from 'file-saver';
import i18nMixin from '../mixins/i18n';
import {readLiveFile} from '../apis/log';
import LiveTime from './Time.vue';

export default {
    name: 'LogView',
    mixins: [i18nMixin],
    components: {LiveTime},
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
            this.stop = readLiveFile('/' + this.fileName, content => {
                this.content = content;
                this.updateTime = new Date();
            });
        },
        handleDownload() {
            const blob = new Blob([this.content], {type: 'text/plain;charset=utf-8'});
            saveAs(blob, this.fileName);
        }
    },
    beforeDestroy() {
        this.stop && this.stop();
    }
}
</script>


<style lang="less" scoped>
.log-view {
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
}
.bar {
    flex: 0 0 auto;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap-reverse;
    border-top: 1px solid #999;
}
.update-time {
    color: gray;
    font-size: 0.9em;
    line-height: 1.5;
}
.content {
    flex: 1 1 auto;
    overflow-y: scroll;
    overflow-x: hidden;

    pre {
        margin: 0;
        white-space: break-spaces;
    }
}
</style>
