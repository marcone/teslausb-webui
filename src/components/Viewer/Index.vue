<template>
    <div class="viewer" :class="{compact: env.compact}">
        <div class="selects">
            <VeuiLoading v-if="!videos" loading>{{ t('fetching-video-list') }}</VeuiLoading>
            <EpisodeSelect v-else class="episode-select" v-model="current" :videos="videos" />
            <VeuiSelect class="layout-select" :value="layout" :options="layouts" @change="handleLayoutChange" />
        </div>
        <Player v-if="current" :video="currentVideo" :key="currentVideo.date.getTime()"
            class="video" :layout="layout" :compact="env.compact" />
    </div>
</template>

<script>
import {last} from 'lodash';
import {tooltip} from 'veui';
import {getVideoList} from '@/apis/video';
import i18nMixin from '../../mixins/i18n';
import Player from './Player.vue';
import BingMap from './BingMap.vue';
import EpisodeSelect from './EpisodeSelect/Index.vue';

export default {
    name: "Viewer",
    mixins: [i18nMixin],
    inject: ['env'],
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
            current: null,
        };
    },
    computed: {
        layouts() {
            return ['1', '2', '3', '4', '5'].map(value => ({value, label: this.t(`layout-${value}`)}));
        },
        currentVideo() {
            const [group, date, time] = this.current.split('$');
            return this.videos[group][date][time];
        }
    },
    methods: {
        handleLayoutChange(val) {
            this.layout = val;
            localStorage.setItem('layout', val);
        }
    },
    async mounted() {
        const load = async () => {
            try {
                this.videos = await getVideoList();
                this.current = getCurrent(this.videos).join('$');
            }
            catch (err) {
                await this.$alert.error(err.message, this.t('fetch-video-list-error'));
                load();
            }
        };

        load();

        const layout = localStorage.getItem('layout');
        if (layout) {
            this.layout = layout;
        }
    }
};

function getCurrent(videos) {
    const group = Object.keys(videos)[0];
    const date = last(Object.keys(videos[group]));
    const time = last(Object.keys(videos[group][date]));
    return [group, date, time];
}
</script>

<style lang="less" scoped>
.viewer {
    margin: 16px 16px 0;
    position: relative;

    &.compact /deep/ .picture {
        font-size: 8px;
    }
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
