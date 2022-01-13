<template>
    <div class="viewer">
        <div class="selects">
            <VeuiLoading v-if="!videos" loading />
            <EpisodeSelect v-else class="episode-select" v-model="current" :videos="videos" />
            <VeuiSelect class="layout-select" v-model="layout" :options="layouts" />
        </div>
        <Player class="video" v-if="current" :video="currentVideo" :layout="layout" :key="currentVideo.date" />
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
            videos: null,
            layout: '1',
            current: undefined,
        };
    },
    computed: {
        layouts() {
            return ['1', '2', '3'].map(value => ({value, label: this.t(`layout-${value}`)}));
        },
        currentVideo() {
            const [group, date, time] = this.current;
            return this.videos[group][date][time];
        }
    },
    async mounted() {
        const load = async () => {
            try {
                this.videos = await getVideoList();
                // this.current = getCurrent(this.videos);
            }
            catch (err) {
                await this.$alert.error(err.message, 'Can not load videos');
                load();
            }
        };

        load();
    }
};

function getCurrent(videos) {
    const group = Object.keys(videos)[0];
    const date = Object.keys(videos[group])[0];
    const time = Object.keys(videos[group][date])[0];
    return [group, date, time];
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
    flex-wrap: wrap-reverse;

    > div {
        margin-bottom: 10px;
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
