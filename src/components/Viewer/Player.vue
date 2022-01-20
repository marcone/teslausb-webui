<template>
    <div class="player" :class="{loading: !videoInfo}">
        <VeuiLoading v-if="!videoInfo" loading>{{t('fetching-video-detail')}}</VeuiLoading>
        <VeuiAlert v-else-if="isError(videoInfo)" type="error" :title="t('fetch-video-detail-error')">
            {{ t(videoInfo.message) || videoInfo.message }}
        </VeuiAlert>
        <template v-else>
            <Videos ref="video"
                :video="combinedVideo"
                :playbackRate="playbackRate"
                :layout="layout"
                @update="videoStatus = $event"
                @playing="isPlaying = $event"
                @click.native="handleVideoClick"
                @dblclick.native="enterFullscreen"
            >
                <template #map v-if="currentLocation">
                    <BingMap :coordinate="currentLocation" />
                </template>
                <template #meta v-if="videoInfo.json">
                    <div>{{ videoInfo.json.city }}</div>
                    <div><small>{{ videoInfo.json.reason }}</small></div>
                </template>
            </Videos>
            <div class="controls">
                <div class="play-buttons">
                    <VeuiButton v-if="!compact" :disabled="currentTime <= 0"
                    class="seek-button" ui="icon" @click="fastseek(-30)">
                        <VeuiIcon name="anticlockwise" />
                    </VeuiButton>
                    <VeuiButton class="play-button" ui="icon" @click="isPlaying ? pause() : play()">
                        <template v-if="isPlaying">
                            <VeuiIcon name="pause" />
                        </template>
                        <template v-else>
                            <VeuiIcon name="play" />
                        </template>
                    </VeuiButton>
                    <VeuiButton v-if="!compact" :disabled="currentTime >= videoInfo.duration - 1"
                        class="seek-button" ui="icon" @click="fastseek(30)">
                        <VeuiIcon name="clockwise" />
                    </VeuiButton>
                </div>
                <Slider class="progress"
                    :value="currentTime / videoInfo.totalDuration"
                    :secondary-progress="buffered"
                    :hot-point="hotPoint"
                    @change="changeCurrentTime"
                >
                    <template v-slot="{value}">{{ formatDuration(value * videoInfo.totalDuration) }}</template>
                </Slider>
                <Dropdown ui="basic xs" v-model="playbackRate" :options="playbackRates">
                    <template v-slot="{label}"><strong>{{label}}</strong></template>
                </Dropdown>
                <div class="time">
                    {{ formatDuration(currentTime) }} / {{ formatDuration(videoInfo.totalDuration) }}
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import {last, clamp, findLastIndex} from 'lodash';
import 'veui-theme-dls-icons/play';
import 'veui-theme-dls-icons/pause';
import 'veui-theme-dls-icons/anticlockwise';
import 'veui-theme-dls-icons/clockwise';
import {getVideoURL, getVideoInfo} from '@/apis/video';
import BingMap from './BingMap.vue';
import {primaryPos, SEGMENT_DURATION} from '@/common';
import Dropdown from '../Dropdown.vue';
import Slider from './Slider.vue';
import Videos from './Videos.vue';

const playbackRates = [0.5, 1, 1.25, 1.5, 2, 4].map(value => ({value, label: `${value}x`}));

export default {
    inject: ['t'],
    components: {Videos, BingMap, Dropdown, Slider},
    props: {
        layout: String,
        video: Object,
        compact: Boolean
    },
    data() {
        return {
            videoInfo: null,
            playbackRates,
            playbackRate: 1,
            isPlaying: false,
            videoStatus: undefined
        };
    },
    computed: {
        currentLocation() {
            if (!this.videoInfo.json) {
                return;
            }
            const {est_lat, est_lon} = this.videoInfo.json;
            return [est_lat, est_lon];
        },
        combinedVideo() {
            return {
                ...this.video,
                width: this.videoInfo.width,
                height: this.videoInfo.height,
                duration: this.videoInfo.totalDuration,
            }
        },
        hotPoint() {
            if (!this.videoInfo.timestamp) {
                return;
            }
            const i = findLastIndex(this.video.clips, clip => clip.date.getTime() < this.videoInfo.timestamp.getTime());
            const offset = (this.videoInfo.timestamp.getTime() - this.video.clips[i].date.getTime()) / 1000;
            const p = (offset + i * SEGMENT_DURATION) / this.combinedVideo.duration;
            return p < .99 ? p : undefined;
        },
        currentTime() {
            return this.videoStatus?.[0];
        },
        buffered() {
            return this.videoStatus?.[1];
        }
    },
    watch: {
        video: {
            immediate: true,
            async handler(video) {
                // In prarent component, this component is associated with a unique key
                // once selected video changes, this component is destroyed and re-created
                // So here we can ignore the async callback race condition for all states are brand-new every time
                try {
                    this.videoInfo = null;
                    this.videoInfo = await this.fetchVideoInfo(video);
                } catch (err) {
                    this.videoInfo = err;
                }
            }
        }
    },
    methods: {
        play() {
            this.$refs.video.play();
        },
        pause() {
            this.$refs.video.pause();
        },
        fastseek(offsetTime) {
            if (this.currentTime <= 0 || this.currentTime >= this.videoInfo.totalDuration - 1) {
                return;
            }
            this.$refs.video.seek(clamp(this.currentTime + offsetTime, 0, this.videoInfo.totalDuration - 1));
        },
        changeCurrentTime(val) {
            this.$refs.video.seek(val * this.videoInfo.totalDuration);
        },
        formatDuration(t) {
            return dayjs.duration(t * 1000).format(t < 3600 ? 'mm:ss' : 'HH:mm:ss');
        },
        enterFullscreen() {
            this.$el.requestFullscreen();
        },

        async fetchVideoInfo(video) {
            const {jsonfile: jsonFilename} = video;
            const {[primaryPos]: mp4Filename} = last(video.clips);
            const videoSrc = getVideoURL(video.group, video.sequence, mp4Filename);
            const {width, height, duration: lastDuration} = await getVideoInfo(videoSrc);
            const totalDuration = SEGMENT_DURATION * (video.clips.length - 1) + lastDuration
            const info = {width, height, lastDuration, totalDuration};

            if (jsonFilename) {
                const jsonUrl = getVideoURL(video.group, video.sequence, jsonFilename);
                info.json = await fetch(jsonUrl).then(res => res.json());
                info.timestamp = dayjs(info.json.timestamp).toDate();
            }

            return info;
        },
        isError(err) {
            return err instanceof Error;
        },

        handleVideoClick(e) {
            if (e.target.closest('.item.video')) {
                this.isPlaying ? this.pause() : this.play();
            }
        },
        handleKeypress(e) {
            switch (e.code) {
                case 'ArrowRight':
                    this.fastseek(30);
                    break;
                case 'ArrowLeft':
                    this.fastseek(-30);
                    break;
                case 'Space':
                    this.isPlaying ? this.pause() : this.play();
                    break;
            }
        }
    },
    mounted() {
        document.addEventListener('keydown', this.handleKeypress);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleKeypress);
    }
}
</script>

<style lang="less" scoped>
.player {
    &.loading {
        aspect-ratio: 2 / 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.controls {
    background: white;
    display: flex;
    align-items: center;
    padding: 0.5rem;
    gap: 1.5em;

    > div,
    > span {
        flex: 0 0 auto;
    }
    .progress {
        flex: 1 1 auto;
    }

    .seek-button {
        font-size: .8em;
    }

    .play-button {
        font-size: 1.2em;
    }

    .play-buttons {
        display: flex;
        gap: 0.75em;
        align-items: center;
    }
}
</style>
