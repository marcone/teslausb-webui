<template>
  <div id="app">
    <VeuiTabs class="head-tabs">
      <VeuiTab label="Diagnostics" to="/diagnostics" />
      <VeuiTab label="Archiveloop log" to="/log/archiveloop" />
      <VeuiTab label="Setup log" to="/log/setup" />
      <VeuiTab label="Tools" to="/tools" />
      <VeuiTab label="Recordings" to="/recordings" />
      <VeuiTab label="Viewer" to="/viewer" />
      <template #extra>
        <div class="head-tabs-rest">
          <VeuiLink ui="strong s" target="_blank" to="https://github.com/marcone/teslausb">TeslaUSB on GitHub</VeuiLink>
        </div>
      </template>
    </VeuiTabs>
    <div class="tab-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import 'veui-theme-dls/common.less'

export default {
  name: 'App'
}
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.head-tabs-rest {
  width: 100%;
  padding-right: 16px;
  text-align: right;
}

.tab-content {
  margin: 0 16px 16px;
}
</style>
