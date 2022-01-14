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
                @timeupdate="currentTime = $event"
                @bufferProgress="bufferedProgress = $event"
                @play="isPlaying = true"
                @pause="isPlaying = false"
            >
                <template #map v-if="currentLocation">
                    <BingMap :coordinate="currentLocation" />
                </template>
            </Videos>
            <div class="controls">
                <VeuiButton class="play-button" ui="icon l" @click="isPlaying ? pause() : play()">
                    <template v-if="isPlaying">
                        <VeuiIcon name="pause" />
                    </template>
                    <template v-else>
                        <VeuiIcon name="play" />
                    </template>
                </VeuiButton>
                <Slider class="progress"
                    :value="currentTime / videoInfo.totalDuration"
                    :secondary-progress="bufferedProgress"
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
import {last} from 'lodash';
import 'veui-theme-dls-icons/play';
import 'veui-theme-dls-icons/pause';
import {getVideoURL, getVideoInfo} from '@/apis/video';
import BingMap from './BingMap.vue';
import {primaryPos} from './common';
import Dropdown from '../Dropdown.vue';
import Slider from './Slider.vue';

const playbackRates = [0.5, 1, 1.25, 1.5, 2, 4].map(value => ({value, label: `${value}x`}));

export default {
    inject: ['t'],
    components: {BingMap, Dropdown, Slider},
    props: {
        layout: String,
        video: Object
    },
    data() {
        return {
            videoInfo: null,
            playbackRates,
            playbackRate: 1,
            isPlaying: false,
            currentTime: 0,
            bufferedProgress: 0
        };
    },
    computed: {
        currentLocation() {
            return; // todo
            if (!this.videoInfo.json) {
                return;
            }
            const {latitude, longitude} = this.videoInfo.json.location;
            return [latitude, longitude];
        },
        combinedVideo() {
            return {
                ...this.video,
                width: this.videoInfo.width,
                height: this.videoInfo.height,
                duration: this.videoInfo.totalDuration,
            }
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
        changeCurrentTime(val) {
            this.$refs.video.seekTo(val * this.videoInfo.totalDuration);
        },
        formatDuration(t) {
            return dayjs.duration(t * 1000).format(t < 3600 ? 'mm:ss' : 'HH:mm:ss');
        },

        async fetchVideoInfo(video) {
            // return {
            //     totalDuration: combinedVideo.duration,
            // };
            const {[primaryPos]: mp4Filename, jsonfile: jsonFilename} = last(video.clips);
            const videoSrc = getVideoURL(video.group, video.sequence, mp4Filename);
            const {width, height, duration: lastDuration} = await getVideoInfo(videoSrc);
            const totalDuration = SEGMENT_DURATION * (video.clips.length - 1) + lastDuration
            const info = {width, height, lastDuration, totalDuration};

            if (jsonFilename) {
                const jsonUrl = getVideoURL(video.group, video.sequence, jsonFilename);
                info.json = await fetch(jsonUrl).then(res => res.json());
            }

            return info;
        },
        isError(err) {
            return err instanceof Error;
        }
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
    display: flex;
    align-items: center;
    padding: 0.5rem;
    gap: 1.5em;

    .play-button {
        flex: 0 0 auto;
    }
    .progress {
        flex: 1 1 auto;
    }
    .time {
        flex: 0 0 auto;
    }
}
</style>
