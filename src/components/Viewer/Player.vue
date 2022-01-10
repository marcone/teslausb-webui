<template>
    <div class="player">
        <div class="picture" :class="`layout-${layout}`">
            <div class="front">front</div>
            <div class="back">back</div>
            <div class="left">left</div>
            <div class="right">right</div>
            <div class="map">map</div>
            <div class="meta">meta</div>
        </div>
        <div class="controls">
            controls
        </div>
    </div>
</template>

<script>
import {MultiTracksPlayer} from './MultiTracks';

export default {
    props: {
        layout: String,
        video: Object
    },
    computed: {
        player() {
            return new MultiTracksPlayer(this.tracks);
        }
    }
}
</script>

<style lang="less" scoped>
.picture {
    background: black;
    color: white;

    display: grid;
    grid-template-columns: repeat(3, 1fr);

    > div {
        aspect-ratio: 4 / 3;
    }

    &.layout-1 {
        .map {order: 0}
        .front {order: 1}
        .meta {order: 2}
        .left {order: 3}
        .back {order: 4}
        .right {order: 5}
    }
    &.layout-2 {
        .left {order: 0}
        .front {order: 1}
        .right {order: 2}
        .map {order: 3}
        .back {order: 4}
        .meta {order: 5}
    }
}
.controls {
    border: 1px solid black;
}
</style>
