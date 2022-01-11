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
import {tooltip} from 'veui';
import {getVideoList} from '@/apis/video';
import i18nMixin from '../../mixins/i18n';
import Player from './Player.vue';
import BingMap from './BingMap.vue';
import EpisodeSelect from './EpisodeSelect.vue';

export default {
    name: "Viewer",
    mixins: [i18nMixin],
    provide() {
        return {
            t: this.t,
        }
    },
    directives: {tooltip},
    components: {Player, BingMap, EpisodeSelect},
    data() {
        return {
            loading: true,
            videos: [],
            layout: '1',
            current: undefined,
        };
    },
    computed: {
        layouts() {
            return ['1', '2', '3'].map(value => ({value, label: this.t(`layout-${value}`)}));
        },
        currentVideo() {
            const [group, seq] = this.current;
            return this.videos[group][seq];
        }
    },
    async mounted() {
        try {
            this.videos = await getVideoList();
            // this.current = getCurrent(this.videos);
            this.loading = false;
        }
        catch (err) {
            this.$alert.error(err.message);
        }
    }
};

function getCurrent(videos) {
    const groups = Object.keys(videos);
    const group = groups.find(group => Object.keys(videos[group]).length);
    const seq = Object.keys(videos[group])[0];
    return [group, seq];
}
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
.layout-select {
    width: auto;
}

.video {
    margin: 1em 0;
}
</style>
