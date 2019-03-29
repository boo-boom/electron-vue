<template>
  <div class="left-menu">
    <router-link class="menu-item" 
      v-for="item in menus" 
      tag="div"
      :to="item.path" 
      :key="item.title">
      <i class="el-icon-circle-plus"></i>
      <span class="title">{{item.title}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'leftMenu',
  data() {
    return {
      curIndex: 0,
      menus: [
        {title: '新增API', path: '/'},
        {title: '修改API', path: '/edit'},
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.left-menu {
  margin-top: 50px;
  color: #fff;
  .menu-item {
    padding: 0 20px;
    margin-top: 20px;
    height: 30px;
    display: flex;
    align-items: center;
    user-select: none;
    transition: all .1s;
    cursor: pointer;
    & > i {
      padding-right: 10px;
      color: #ccc;
      transition: all .1s;
    }
  }
  .router-link-exact-active {
    color: #409EFF;
    & > i {
      color: #409EFF;
    }
  }
}
</style>
