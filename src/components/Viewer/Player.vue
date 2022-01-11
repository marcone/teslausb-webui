<template>
    <div class="player" :class="{loading: !videoInfo}">
        <template v-if="videoInfo">
            <div class="picture" :class="`layout-${layout}`" ref="picture">
                <div :class="pos" v-for="pos in positions" :key="pos">
                    <video muted v-bind="videoProps[pos]"></video>
                </div>
                <div class="map">map</div>
                <div class="meta">meta</div>
            </div>
            <div class="controls">
                <VeuiButton class="play-button" ui="text" @click="isPlaying ? pause : play" :disabled="isBuffering">
                    {{ isPlaying ? '⏸' : '▶️' }}
                </VeuiButton>
                <VeuiSlider class="progress" :value="currentTotalTime / videoInfo.duraiton" @input="handleProgressChange" />
                <div class="time">
                    00:00/00:00
                </div>
            </div>
        </template>
        <VeuiLoading v-else loading />
    </div>
</template>

<script>
import {getVideoURL, getVideoInfo} from '@/apis/video';

const positions = ['front', 'back', 'left', 'right'];

export default {
    props: {
        layout: String,
        video: Object
    },
    data() {
        return {
            positions,
            videoInfo: null,

            playbackRate: 1,
            currentClipIndex: 0,
            currentClipTime: 0,
            isPlaying: false,
            isBuffering: false
        };
    },
    computed: {
        currentClip() {
            return this.video.clips[this.currentClipIndex];
        },
        currentTotalTime() {
            return this.video.clips.slice(0, this.currentClipIndex)
                .reduce((total, clip) => total + clip.duration, 0) + this.currentClipTime;
        },
        videoProps() {
            const {group, sequence} = this.video;
            return positions.reduce((ret, key) => {
                const filename = this.currentClip[key];
                ret[key] = {
                    src: getVideoURL(group, sequence, filename),
                    width: this.videoInfo.width,
                    height: this.videoInfo.height,
                };
                return ret;
            }, {});
        }
    },
    watch: {
        video(video) {
            // TODO: get total duraiton: (n - 1) * 60 + last.duration
            // TODO: read json if exists
            // this.videoInfo = {};
        }
    },
    methods: {
        seekTo(time) {

        },
        play() {

        },
        pause() {

        },
        handleProgressChange(val) {
            seekTo(val * this.videoInfo.duration);
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

.picture {
    background: black;
    color: white;

    display: grid;
    grid-template-columns: repeat(3, 1fr);

    > div {
        aspect-ratio: 4 / 3;
    }

    video {
        display: block;
        width: 100%;
        height: 100%;
    }

    &.layout-1 {
        .left {order: 0; transform: rotateY(180deg);}
        .front {order: 1}
        .right {order: 2; transform: rotateY(180deg);}
        .map {order: 3}
        .back {order: 4; transform: rotateY(180deg);}
        .meta {order: 5}
    }
    &.layout-2 {
        .map {order: 0}
        .front {order: 1}
        .meta {order: 2}
        .left {order: 3; transform: rotateY(180deg);}
        .back {order: 4; transform: rotateY(180deg);}
        .right {order: 5; transform: rotateY(180deg);}
    }
    &.layout-3 {
        .map {order: 0}
        .front {order: 1}
        .meta {order: 2}
        .right {order: 3;}
        .back {order: 4}
        .left {order: 5;}
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
        margin: 0 1em;
    }
    .time {
        flex: 0 0 auto;
    }
}
</style>
