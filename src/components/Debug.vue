<template>
    <div>
        <Videos ref="video" :video="combinedVideo" :playbackRate="parseFloat(playbackRate)" layout="1"
            @timeupdate="currentTime = $event"
            @bufferProgress="bufferedProgress = $event">
            <template #map>
                <BingMap :coordinate="[31.1844658, 121.6052347]" />
            </template>
        </Videos>

        <div>
            t={{ Math.round(currentTime) }};
            tp={{ Math.round(currentTime / combinedVideo.duration * 100) }}%；
            b={{ Math.round(bufferedProgress * 100) }}%</div>
        <div>
            <input v-model="playbackRate" type="range" min="0.5" max="2" step="0.5" />
            <input type="number" @change="handleSeek" />
            <button @click="play">play</button>
            <button @click="pause">pause</button>
        </div>
    </div>
</template>

<script>
const combinedVideo = {
    group: 'a',
    sequence: 'b',
    date: new Date,
    width: 1280,
    height: 960,
    duration: 230,
    clips: [
        {
            front: '2022-01-06_10-27-31-front.mp4',
            back: '2022-01-06_10-27-31-back.mp4',
            left_repeater: '2022-01-06_10-27-31-left_repeater.mp4',
            right_repeater: '2022-01-06_10-27-31-right_repeater.mp4',
        },
        {
            front: '2022-01-06_10-28-31-front.mp4',
            back: '2022-01-06_10-28-31-back.mp4',
            left_repeater: '2022-01-06_10-28-31-left_repeater.mp4',
            right_repeater: '2022-01-06_10-28-31-right_repeater.mp4',
        },
        {
            front: '2022-01-06_10-29-32-front.mp4',
            back: '2022-01-06_10-29-32-back.mp4',
            left_repeater: '2022-01-06_10-29-32-left_repeater.mp4',
            right_repeater: '2022-01-06_10-29-32-right_repeater.mp4',
        },
        {
            front: '2022-01-06_10-30-32-front.mp4',
            back: '2022-01-06_10-30-32-back.mp4',
            left_repeater: '2022-01-06_10-30-32-left_repeater.mp4',
            right_repeater: '2022-01-06_10-30-32-right_repeater.mp4',
        }
    ]
};

export default {
    data() {
        return {
            currentTime: 0,
            bufferedProgress: 0,
            combinedVideo,
            playbackRate: 1
        }
    },
    methods: {
        play() {
            this.$refs.video.play();
        },
        pause() {
            this.$refs.video.pause();
        },
        handleSeek(e) {
            const t = parseFloat(e.target.value);
            if (!isNaN(t)) {
                console.log('seek time', t);
                this.$refs.video.seekTo(t);
            }
        }
    }
}
</script>
