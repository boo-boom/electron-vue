<template>
  <div id="app">
    <!-- <system-information></system-information> -->
    <el-container>
      <el-aside width="200px">
        <LeftMenu/>
      </el-aside>
      <el-container>
        <div class="darg"></div>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SystemInformation from '@/components/SystemInformation'
import LeftMenu from '@/components/LeftMenu'
export default {
  name: 'electron-vue',
  components: { SystemInformation, LeftMenu },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  .darg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: transparent;
    -webkit-app-region: drag;
    height: 25px;
  }
}
</style>
