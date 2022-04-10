<template>
    <div class="pi-status" v-if="piStatus">
        <div class="uptime-row">
            <span>🟢 {{ uptime(piStatus.uptime) }}</span>
            <span>🔥 {{ temp(piStatus.cpuTemp) }}</span>
        </div>
        <VeuiProgress class="size-indicator" :max="piStatus.totalSize" :value="usedSize" desc>
            <span>{{ bytes(usedSize) }} / {{ bytes(piStatus.totalSize) }}</span>
            <span class="left-space">({{ piStatus.snapCount }} snapshot{{ piStatus.snapCount > 1 ? 's' : '' }}, {{ secondsToDate(piStatus.snapOldest) }} {{ piStatus.snapCount > 1 ? ' - ' + secondsToDate(piStatus.snapNewest) : '' }})</span>
        </VeuiProgress>
        <div class="connected-row">
            <span class="clickable" @click="handleToggleDriveClick">
                <span>💾</span>
                <span>{{ piStatus.drivesActive == "yes" ? '―――――' : '――/――' }}</span>
                <span>🚘</span>
            </span>
        </div>
    </div>
</template>

<script>
import {getPiStatus, toggleDrives} from '../apis/device';
import bytes from 'bytes';

const dtopts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const dateTimeFormat = new Intl.DateTimeFormat(navigator.language, dtopts);

export default {
    data() {
        return {
            piStatus: undefined
        }
    },
    computed: {
        usedSize() {
            const {freeSize, totalSize} = this.piStatus;
            return totalSize - freeSize;
        }
    },
    methods: {
        bytes(val) {
            return bytes(val, {decimalPlaces: 0});
        },
        uptime(secs) {
          secs = Math.round(secs);
          var days = Math.trunc(secs / (24 * 3600));
          var hours = Math.trunc(secs % (24 * 3600) / 3600);
          var minutes = Math.trunc(secs % (3600) / 60);
          var seconds = Math.trunc(secs % 60);
          var out = "";
          if (days == 1) {
            out = "1 day, "
          } else if (days > 1) {
            out = days + " days, "
          }
          return out + hours.toString().padStart(2, 0) + ":" +
                       minutes.toString().padStart(2,0) + ":" +
                       seconds.toString().padStart(2,0);
        },
        temp(millidegrees) {
            return (millidegrees / 1000).toFixed(1) + " C";
        },
        secondsToDate(seconds) {
            var d = new Date(0);
            d.setUTCSeconds(seconds);
            return dateTimeFormat.format(d);
        },
        async refresh() {
            try {
                this.piStatus = await getPiStatus();
            } catch {}
        },
        async handleToggleDriveClick() {
            await toggleDrives();
        }
    },
    mounted() {
        this.refresh();
        this.timer = setInterval(() => this.refresh(), 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
}
</script>

<style lang="less" scoped>
@import "~less-plugin-dls/tokens/index.less";

.pi-status {
    padding: 1em 20px;
    border: 1px solid @dls-line-color-2;
    border-radius: @dls-border-radius-2;
    box-shadow: @dls-shadow-2;
    font-family: monospace;
}

.size-indicator {
    margin-top: 10px;
    flex-wrap: wrap;
}
.left-space {
    margin-left: 1em;
}

.uptime-row {
    margin-bottom: 5px;
    & > span::after {
        content: ",";
        color: gray;
    }
    & > span:last-child::after {
        content: unset;
    }

    & > span {
        display: inline-block;
        margin-right: 1.2em;
    }
}

.connected-row {
    margin-top: 10px;
}

.clickable {
    cursor: pointer;
}
</style>
