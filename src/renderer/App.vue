<template>
  <div id="app">
    <div class="darg"></div>
    <system-information></system-information>
    <router-view></router-view>
  </div>
</template>

<script>
import SystemInformation from '@/components/SystemInformation'
export default {
  name: 'electron-vue',
  components: { SystemInformation },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}
.darg {
  -webkit-app-region: drag;
  height: 100px;
  background: #eee;
}
</style>
