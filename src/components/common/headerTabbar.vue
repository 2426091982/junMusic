<template>
<!-- 
  ******************by  jun *****************
  props传入 tabbar 数组对象tabbarList  包括  id, title标题, path跳转路径, active状态
 -->
  <div>
    <ul class="container">
      <li
        @click="jumpRouter(item)"
        :class="item.active ? 'active' : ''"
        class="item"
        v-for="item in tabbarList"
        :key="item.id"
      >
        <span class="title">
          {{ item.title }}
        </span>
        <div class="block"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    jumpRouter(item) {
      if (this.$route.path !== item.path) {
        // 路由跳转
        this.$router.push(item.path);
      }
    },
  },
  props: ["tabbarList"],
};
</script>

<style lang="less" scoped>
.container {
  height: 2rem;
  width: 100vw;
  background-color: #ec4036;
  display: flex;
  align-items: flex-end;
  padding-bottom: 5px;
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      color: #e4e4e4;
      font-size: 14px;
      margin-bottom: 2px;
    }

    .block {
      display: flex;
      height: 2px;
      width: 30px;
      border-radius: 5px;
    }
  }
  .active .block {
    background-color: #fff;
  }
  .active .title {
    font-weight: 700;
    color: #fff;
  }
}
</style>
