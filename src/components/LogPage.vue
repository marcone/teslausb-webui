<template>
    <LogView class="log-page" v-bind="current"  />
</template>

<script>
import LogView from './LogView';

const typeMap = {
    archiveloop: ['Archiveloop log', 'archiveloop.log'],
    setup: ['Setup log', 'teslausb-headless-setup.log']
};

export default {
    components: {LogView},
    data() {
        return {
            category: undefined
        }
    },
    computed: {
        current() {
            const [title, fileName] = typeMap[this.category];
            return {title, fileName};
        }
    },
    beforeRouteEnter(to, from, next) {
        const {category} = to.params;
        next(vm => {
            vm.category = category;
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.category = to.params.category;
    }
}
</script>
