<template>
    <div class="video">
        <video ref="video" muted preload="auto" playsinline :width="width" :height="height" :src="currentClip"
            @waiting="$emit('waiting')"
            @ended="$emit('ended')"
            @seeked="$emit('seeked')"
            @canplaythrough="$emit('canplaythrough')"
            @timeupdate="handleTimeUpdate"
            @progress="handleProgress"
        ></video>

        <video class="preload-video" v-if="shouldPreloadNext" muted preload="auto" playsinline :src="nextClip"></video>
    </div>
</template>

<script>
import {SEGMENT_DURATION} from './common';

export default {
    props: {
        width: Number,
        height: Number,
        playbackRate: Number,
        clips: Array,
        duration: Number
    },
    data() {
        return {
            buffered: 0,
            currentTime: 0,
            currentClipIndex: 0,
        };
    },
    computed: {
        currentClip() {
            return this.clips[this.currentClipIndex];
        },
        nextClip() {
            return this.clips[this.currentClipIndex + 1];
        },
        shouldPreloadNext() {
            if (this.currentClipIndex + 1 === this.clips.length) {
                return false;
            }
            // preload next if there is enough bandwidth
            return this.currentTime > SEGMENT_DURATION * .8 && this.buffered > .95;
        }
    },
    methods: {
        seek(time) {
            this.pause();
            this.currentClipIndex = Math.floor(time / SEGMENT_DURATION);
            const seekTime = time - this.currentClipIndex * SEGMENT_DURATION;
            this.$nextTick(() => {
                this.$refs.video.currentTime = seekTime;
            });
        },
        next() {
            if (this.currentClipIndex + 1 === this.clips.length) {
                const err = new Error('No more clips');
                err._end = true;
                throw err;
                return;
            }
            this.currentClipIndex++;
            this.currentTime = 0;
            this.buffered = 0;
        },
        play() {
            this.$refs.video.play();
        },
        pause() {
            this.$refs.video.pause();
        },
        handleProgress(e) {
            const buffered = e.target.buffered.length > 0 ? e.target.buffered.end(0) : 0;
            this.buffered = buffered;
            this.$emit('progress', (this.currentClipIndex * SEGMENT_DURATION + buffered) / this.duration);
        },
        handleTimeUpdate(e) {
            this.currentTime = e.target.currentTime;
            this.$emit('timeupdate', this.currentTime + SEGMENT_DURATION * this.currentClipIndex);
        }
    },
    watch: {
        playbackRate: {
            immediate: true,
            handler(val) {
                this.$nextTick(() => {
                    this.$refs.video.playbackRate = val;
                });
            }
        }
    }
}
</script>

<style lang="less" scoped>
.video {
    &, video {
        width: 100%;
        height: 100%;
    }

    video {
        display: block;
    }

    .preload-video {
        display: none;
    }
}
</style>
