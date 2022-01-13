<template>
    <div class="player" :class="{loading: !videoInfo}">
        <VeuiLoading v-if="!videoInfo" loading />
        <VeuiAlert v-if="(videoInfo instanceof Error)" type="error" title="Fetch video fail">
            {{ videoInfo.message }}
        </VeuiAlert>
        <template v-else>
            <Videos ref="video" :video="combinedVideo" :playbackRate="playbackRate" :layout="layout"
                @timeupdate="currentTime = $event"
                @bufferProgress="bufferedProgress = $event">
                <template #map v-if="currentLocation">
                    <BingMap :coordinate="currentLocation" />
                </template>
            </Videos>
            <div class="controls">
                <VeuiButton class="play-button" ui="text" @click="isPlaying ? pause : play">
                    {{ isPlaying ? '⏸' : '▶️' }}
                </VeuiButton>
                <VeuiSlider class="progress"
                    :value="currentTime / videoInfo.totalDuration"
                    :secondary-progress="bufferedProgress"
                    @input="debouncedChangeCurrentTime"
                >
                    <template #tip-label>{{ formatDuration(currentTime) }}</template>
                </VeuiSlider>
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
import {getVideoURL, getVideoInfo} from '@/apis/video';
import BingMap from './BingMap.vue';

export default {
    components: {BingMap},
    props: {
        layout: String,
        video: Object
    },
    data() {
        return {
            videoInfo: null,
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
        debouncedChangeCurrentTime() {
            return debounce(this.changeCurrentTime, 300);
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
                    this.videoInfo = await Promise.race([this.fetchVideoInfo(video), cancelPromise]);
                } catch (err) {
                    this.videoInfo = err;
                }
            }
        }
    },
    methods: {
        play() {
            this.isPlaying = true;
            this.$refs.video.play();
        },
        pause() {
            this.$refs.video.pause();
            this.isPlaying = false;
        },

        changeCurrentTime(val) {
            seekTo(val * this.videoInfo.totalDuration);
        },
        formatDuration(t) {
            return dayjs.duration(t * 1000).format(t < 3600 ? 'mm:ss' : 'HH:mm:ss');
        },

        async fetchVideoInfo(video) {
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

    .play-button {
        flex: 0 0 auto;
    }
    .progress {
        flex: 1 1 auto;
        margin: 0 1.5em;
    }
    .time {
        flex: 0 0 auto;
    }
}
</style>
