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
                <Time :time="currentDate" />
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

const positions = ['front', 'back', 'left_repeater', 'right_repeater'];
const primaryPos = positions[0];

export default {
    components: {ClipsVideo, Time},
    props: {
        layout: String,
        playbackRate: Number,
        video: Object
    },
    data() {
        return {
            positions,
            currentTime: 0,
            isWaitting: false,
            buffereds: fromPairs(positions.map(pos => [pos, 0])),
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
    },
    methods: {
        async seekTo(time) {
            this.pause();
            this.$refs.videos.map(video => video.seek(time));
            await new Promise(resolve => setTimeout(resolve, 100));
            this.play();
        },
        async play() {
            this.pause();
            this.$refs.videos.forEach(video => video.play());

            // wait all videos are ended to play next clip togehter
            await Promise.all(this.$refs.videos.map(video => new Promise(resolve => {
                video.$once('ended', resolve);
            })));

            // wait for all videos are ready after switching to next clip
            this.isWaitting = true;
            try {
                await Promise.all(this.$refs.videos.map(video => new Promise(resolve => {
                    video.$once('canplaythrough', resolve);
                    video.next();
                })));
                this.play();
            }
            catch (err) {
                if (err._end) {
                    this.$nextTick(() => this.seekTo(0));
                }
            }
            finally {
                this.isWaitting = false;
            }
        },
        async handleVideoWaiting(pos) {
            // once any video is waiting, pause all videos
            this.pause();
            this.isWaitting = true;
            await new Promise(resolve => {
                this.$refs.videos[positions.indexOf(pos)].$once('canplaythrough', resolve);
            });
            this.isWaitting = false;
            this.play();
        },
        pause() {
            this.$refs.videos.forEach(video => {
                video.$off('ended');
                video.$off('canplaythrough');
                video.pause();
            });
            this.isWaitting = false;
        },
        handleVideoTimeUpdate(pos, time) {
            this.currentTime = time;
            this.$emit('timeupdate', time);
        },
        handleVideoBufferProgress(pos, buffered) {
            this.buffereds[pos] = buffered;
        }
    },
    watch: {
        currentBufferedPercent(val) {
            this.$emit('bufferProgress', val);
        }
    }
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
    grid-template-columns: repeat(3, 1fr);

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
}

.map {
    > div {
        width: 100%;
        height: 100%;
    }
}

.meta {
    padding: 1em;
    font-size: 2em;
}
</style>
