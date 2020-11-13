<template>
<!-- 
    @by jun  头部组件
    使用方式  
    // 具名插槽  left title right
    ********************
  -->
  <div class="app-header">
    <!-- 左边内容 -->
    <div @click="leftClick" class="left">
      <slot name="left"></slot>
    </div>
    <!-- 标题 -->
    <div class="title">
      <slot name="title"></slot>
    </div>
    <!-- 右边内容-->
    <div @click="rightClick" class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods:{
    leftClick(){
      // 发送事件给父组件
      this.$emit('leftClick');
    },
    rightClick(){
      // 发送事件给父组件
      this.$emit('rightClick');
    }
  }
};
</script>

<style lang="less" scoped>
.app-header {
  width: 100vw;
  height: 3rem;
  background-color: #ec4036;
  display: flex;
  align-items: center;
  color: #fff;
  .left {
    text-align: center;
    flex: 1;
  }

  .title {
    text-align: center;
    flex: 3;
  }

  .right {
    text-align: center;
    flex: 1;
  }
}
</style>
