<template>
    <div class="videos">
        <div class="picture" :class="{[`layout-${layout}`]: true}">
            <div class="item video" :class="pos"
                v-for="pos in positions" :key="pos" ref="videoContainers"></div>
            <div class="item map">
                <slot name="map" />
            </div>
            <div class="item meta">
                <div><Time :time="currentDate" /></div>
                <slot name="meta"></slot>
            </div>
        </div>
        <div v-if="isWaiting" class="loading">
            <VeuiLoading loading ui="reverse" />
        </div>
    </div>
</template>

<script>
import {fromPairs, zipObject} from 'lodash';
import {getVideoURL} from '@/apis/video';
import Time from '../Time.vue';
import {positions, SEGMENT_DURATION} from '@/common';
import MultipleVideoController from './MultipleVideoController';

const enablePreload = true;

export default {
    components: {Time},
    props: {
        layout: String,
        playbackRate: Number,
        video: Object,
    },
    data() {
        return {
            positions,
            currentClipIndex: 0,
            isPlaying: false,
            videoController: undefined
        };
    },
    computed: {
        currentClip() {
            return this.getClip(this.currentClipIndex);
        },
        isWaiting() {
            return this.videoController?.isWaiting;
        },
        currentTime() {
            return this.currentClipIndex * SEGMENT_DURATION + this.videoController?.currentTime;
        },
        currentDate() {
            const clipDate = this.video.clips[this.currentClipIndex].date;
            return new Date(clipDate.getTime() + this.videoController?.currentTime * 1000);
        },
        buffered() {
            return (this.currentClipIndex * SEGMENT_DURATION + this.videoController?.buffered) / this.video.duration;
        },
    },
    watch: {
        playbackRate(val) {
            this.videoController.playbackRate = val;
        },
        currentTime(val) {
            this.$emit('update', [val, this.buffered]);
        },
        buffered(val) {
            this.$emit('update', [this.currentTime, val]);
        },
        isPlaying(val) {
            this.$emit('playing', val);
        },
        currentClipIndex: {
            immediate: true,
            handler(clipIndex) {
                // destroy current controller and create the next one
                // TBD: use MPEG-DASH to enhance performance significantly
                this.videoController && this.videoController.destroy();
                this.videoController = this.createVideoController(clipIndex);
            }
        }
    },
    methods: {
        getClip(i) {
            const {clips, group, sequence} = this.video;
            return fromPairs(positions.map(key => {
                const filename = clips[i][key];
                return [key, {key, src: getVideoURL(group, sequence, filename)}];
            }));
        },
        createVideoController(clipIndex) {
            const controller = this.videoController?.next?.clipIndex === clipIndex
                ? this.videoController.next
                : new MultipleVideoController(this.getClip(clipIndex), true);

            controller.playbackRate = this.playbackRate;
            controller.on('ended', () => {
                if (this.currentClipIndex + 1 >= this.video.clips.length) {
                    this.currentClipIndex = 0;
                    this.isPlaying = false;
                    return;
                }
                this.nextAutoplay = ++this.currentClipIndex;
            });
            this.$nextTick(() => {
                const containers = zipObject(this.positions, this.$refs.videoContainers);
                controller.attach(containers);
            });
            if (this.nextAutoplay === this.currentClipIndex) {
                controller.play();
            }

            // preload next if current videos are all loaded
            const nextClipIndex = clipIndex + 1;
            if (enablePreload && nextClipIndex < this.video.clips.length) {
                setTimeout(() => {
                    const nextController = new MultipleVideoController(this.getClip(nextClipIndex), false);
                    this.videoController.next = nextController;
                    this.videoController.next.clipIndex = nextClipIndex;

                    controller.on('buffered', p => p > .99 && nextController.load());
                }, 0);
            }

            return controller;
        },
        play() {
            this.isPlaying = true;
            this.videoController.play();
        },
        pause() {
            this.videoController.pause();
            this.isPlaying = false;
        },
        seek(time) {
            const clipIndex = Math.floor(time / SEGMENT_DURATION);
            const timeInClip = time % SEGMENT_DURATION;
            if (clipIndex !== this.currentClipIndex) {
                this.currentClipIndex = clipIndex;
                if (this.isPlaying) {
                    this.nextAutoplay = clipIndex;
                }
                this.$nextTick(() => {
                    this.videoController.currentTime = timeInClip;
                });
            }
            else {
                this.videoController.currentTime = timeInClip;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.videos {
    position: relative;

    .loading {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .veui-loading {
            font-size: 3em;
        }
    }
}

.picture {
    background: black;
    color: white;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));

    .item {
        aspect-ratio: 4 / 3;
    }

    /deep/ video {
        display: block;
        width: 100%;
        height: 100%;
    }

    &.layout-1,
    &.layout-2,
    &.layout-4,
    &.layout-5 {
        .left_repeater,
        .right_repeater,
        .back {
            /deep/ video {
                transform: rotateY(180deg);
            }
        }
    }

    &.layout-1 {
        .left_repeater {order: 0}
        .front {order: 1}
        .right_repeater {order: 2}
        .map {order: 3}
        .back {order: 4}
        .meta {order: 5}
    }
    &.layout-2 {
        .map {order: 0}
        .front {order: 1}
        .meta {order: 2}
        .left_repeater {order: 3}
        .back {order: 4}
        .right_repeater {order: 5}
    }
    &.layout-3 {
        .map {order: 0}
        .front {order: 1}
        .meta {order: 2}
        .right_repeater {order: 3}
        .back {order: 4}
        .left_repeater {order: 5}
    }

    &.layout-4 {
        grid-template-areas:
            "meta front front"
            "map front front"
            "left  back  right";

        .front {grid-area: front}
        .meta {grid-area: meta}
        .map {grid-area: map}
        .left_repeater {grid-area: left}
        .back {grid-area: back}
        .right_repeater {grid-area: right}
    }

    &.layout-5 {
        grid-template-areas:
            "meta  map   map"
            "front front front"
            "left  back  right";

        .front,
        .meta,
        .map {
            aspect-ratio: 16 / 9;
        }

        .front {
            grid-area: front;
            /deep/ video {
                object-fit: cover;
            }
        }
        .meta {
            grid-area: meta;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column-reverse;
        }
        .map {grid-area: map}
        .left_repeater {grid-area: left}
        .back {grid-area: back}
        .right_repeater {grid-area: right}
    }
}

.video {
    position: relative;

    &::after {
        content: attr(data-error);
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        text-align: center;
        word-break: break-all;
    }
}

.map {
    > div {
        width: 100%;
        height: 100%;
    }
}

.meta {
    padding: 0.8em;
    font-size: 1.4em;
    word-break: break-all;

    &:first-child {
        word-break: break-word;
    }
}
</style>
