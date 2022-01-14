<template>
    <div class="videos">
        <div class="picture" :class="{[`layout-${layout}`]: true}">
            <div :class="pos" v-for="pos in positions" :key="pos">
                <ClipsVideo ref="videos"
                    :playbackRate="playbackRate"
                    v-bind="posToClipsMap[pos]"
                    v-on="posToVideoEventMap[pos]"
                />
            </div>
            <div class="map">
                <slot name="map" />
            </div>
            <div class="meta">
                <div><Time :time="currentDate" /></div>
                <slot name="meta"></slot>
            </div>
        </div>
        <div v-if="isWaitting" class="loading">
            <VeuiLoading loading ui="reverse" />
        </div>
    </div>
</template>

<script>
import {fromPairs, mapValues, omitBy, partial, isUndefined} from 'lodash';
import {getVideoURL} from '@/apis/video';
import ClipsVideo from './Video.vue';
import Time from '../Time.vue';
import {positions, primaryPos} from './common';

export default {
    components: {ClipsVideo, Time},
    props: {
        layout: String,
        playbackRate: Number,
        video: Object,
    },
    data() {
        return {
            positions,
            currentTime: 0,
            isPlaying: false,
            buffereds: fromPairs(positions.map(pos => [pos, 0])),
            waitingFlags: fromPairs(positions.map(pos => [pos, false])),
        };
    },
    computed: {
        posToClipsMap() {
            const {group, sequence, width, height, duration} = this.video;
            return positions.reduce((ret, key) => {
                const clips = this.video.clips.map(clip => getVideoURL(group, sequence, clip[key]));
                ret[key] = {clips, width, height, duration};
                return ret;
            }, {});
        },
        posToVideoEventMap() {
            return positions.reduce((ret, key) => {
                ret[key] = mapValues(omitBy({
                    play: key === primaryPos ? this.handleVideoPlay : undefined,
                    pause: key === primaryPos ? this.handleVideoPause : undefined,
                    timeupdate: key === primaryPos ? this.handleVideoTimeUpdate : undefined,
                    progress: this.handleVideoBufferProgress,
                    waiting: this.handleVideoWaiting,
                }, isUndefined), fn => partial(fn, key));
                return ret;
            }, {});
        },
        currentBufferedPercent() {
            return Math.min(...Object.values(this.buffereds));
        },
        currentDate() {
            return new Date(this.video.date.getTime() + this.currentTime * 1000);
        },
        isWaitting() {
            return Object.values(this.waitingFlags).some(flag => flag);
        },
    },
    methods: {
        async seekTo(time) {
            const isPreviousPlaying = this.isPlaying;
            this.pause();
            await this.callVideos(video => video.seek(time));
            await delay(100);
            await (isPreviousPlaying && this.play());
        },
        async play() {
            this.pause();
            await this.callVideos(video => video.play());

            const cancelPromise = new Promise((resolve, reject) => {
                this.cancelPreviousWaitForEnd = reject;
            });

            // wait all videos are ended to play next clip togehter
            return Promise.race([this.callVideos(video => onceEvent(video, 'ended')), cancelPromise])
                .then(() => this.callVideos(video => video.next()))
                .then(() => this.play())
                .catch((err) => err?._end && this.seekTo(0));
        },
        async handleVideoWaiting(pos) {
            if (this.waitingFlags[pos]) {
                return;
            }
            this.waitingFlags[pos] = true;
            // once any video is waiting, pause all videos
            const video = this.$refs.videos[positions.indexOf(pos)];
            await new Promise(resolve => video.$once('canplaythrough', resolve));
            await delay(100);
            this.waitingFlags[pos] =false;
        },
        async pause() {
            this.callVideos(video => {
                video.$off('ended');
                video.pause();
            });
            // previous wait-for-end promise will never settled after removing the event listener
            // so we need to cancel it to prevent memory leak
            this.cancelPreviousWaitForEnd && this.cancelPreviousWaitForEnd();
        },
        handleVideoTimeUpdate(pos, time) {
            this.currentTime = time;
            this.$emit('timeupdate', time);
        },
        handleVideoBufferProgress(pos, buffered) {
            this.buffereds[pos] = buffered;
        },
        handleVideoPlay() {
            this.isPlaying = true;
            this.$emit('play');
        },
        handleVideoPause() {
            this.isPlaying = false;
            this.$emit('pause');
        },

        callVideos(fn) {
            return Promise.all(this.$refs.videos.map(fn));
        }
    },
    watch: {
        currentBufferedPercent(val) {
            this.$emit('bufferProgress', val);
        }
    },
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function onceEvent(el, event) {
    return new Promise(resolve => {
        el.$once(event, resolve);
    });
}
</script>

<style lang="less" scoped>
.videos {
    position: relative;
    &::after {
        content: '';
        position: absolute;
        inset: 0;
    }

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

    > div {
        aspect-ratio: 4 / 3;
    }

    &.layout-1 {
        .left_repeater {order: 0; transform: rotateY(180deg);}
        .front {order: 1}
        .right_repeater {order: 2; transform: rotateY(180deg);}
        .map {order: 3}
        .back {order: 4; transform: rotateY(180deg);}
        .meta {order: 5}
    }
    &.layout-2 {
        .map {order: 0}
        .front {order: 1}
        .meta {order: 2}
        .left_repeater {order: 3; transform: rotateY(180deg);}
        .back {order: 4; transform: rotateY(180deg);}
        .right_repeater {order: 5; transform: rotateY(180deg);}
    }
    &.layout-3 {
        .map {order: 0}
        .front {order: 1}
        .meta {order: 2}
        .right_repeater {order: 3;}
        .back {order: 4}
        .left_repeater {order: 5;}
    }

    &.layout-4 {
        grid-template-areas: "date front front"
                             "map front front"
                             "left  back  right";

        .front {grid-area: front}
        .date {grid-area: date}
        .map {grid-area: map}
        .left_repeater {grid-area: left; transform: rotateY(180deg);}
        .back {grid-area: back}
        .right_repeater {grid-area: right; transform: rotateY(180deg);}
    }

    &.layout-5 {
        grid-template-areas: "date  map   map"
                             "front front front"
                             "left  back  right";

        .front,
        .date,
        .map {
            aspect-ratio: 16 / 9;
        }

        .front {
            grid-area: front;
            /deep/ video {
                object-fit: cover;
            }
        }
        .date {grid-area: date}
        .map {grid-area: map}
        .left_repeater {grid-area: left; transform: rotateY(180deg);}
        .back {grid-area: back}
        .right_repeater {grid-area: right; transform: rotateY(180deg);}
    }
}

.map {
    > div {
        width: 100%;
        height: 100%;
    }
}

.meta {
    padding: 0.5em;
    font-size: 1.4em;
}
</style>
