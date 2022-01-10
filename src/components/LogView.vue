<template>
    <div class="log-view">
        <div class="bar">
            <div>
                <slot name="buttons" :loading="!content" />
                <VeuiButton ui="s" :loading="!content" @click="handleDownload">
                    {{ t('download', {title}) }}
                </VeuiButton>
            </div>
            <div class="update-time">{{ ft(updateTime) }}</div>
        </div>
        <div class="content">
            <pre>{{content}}</pre>
        </div>
    </div>
</template>

<script>
import {saveAs} from 'file-saver';
import i18nMixin from '../mixins/i18n';
import {readLiveFile} from '../apis/log';
import {formatTimeFromNow} from '../locale';

export default {
    name: 'LogView',
    mixins: [i18nMixin],
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
        formatTimeFromNow,
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
    overflow: auto;

    pre {
        white-space: break-spaces;
    }
}
</style>
