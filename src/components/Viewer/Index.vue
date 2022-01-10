<template>
    <div class="viewer">
        <div class="selects">
            <EpisodeSelect class="episode-select" v-model="current" :videos="videos" />
            <VeuiSelect class="layout-select" v-model="layout" :options="layouts" />
        </div>
        <Player class="video" v-if="current" :video="currentVideo" :layout="layout" />
    </div>
</template>

<script>
import {getVideoList} from '@/apis/video';
import Player from './Player.vue';
import BingMap from './BingMap.vue';
import EpisodeSelect from './EpisodeSelect.vue';

const layouts = [
    {value: '1', label: '1'},
    {value: '2', label: '2'},
];

export default {
    name: "Viewer",
    components: {Player, BingMap, EpisodeSelect},
    data() {
        return {
            loading: true,
            videos: [],
            layouts,
            layout: layouts[0].value,
            current: 1,
        };
    },
    computed: {
        currentVideo() {

        }
    },
    async mounted() {
        try {
            this.videos = await getVideoList();
            // this.current = this.videos[0];
            this.loading = false;
        }
        catch (err) {
            this.$alert.error(err.message);
        }
    }
};
</script>

<style lang="less" scoped>
.viewer {
    margin: 16px 16px 0;
    position: relative;
}
.selects {
    display: flex;
    justify-content: space-between;

    > div {
        flex: 0 0 auto;
    }
}
.episode-select {
    width: 200px;
}
.layout-select {
    width: 100px;
}

.video {
    margin: 1em 0;
}
</style>
