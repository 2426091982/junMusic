<template>
  <!-- 
    @by jun
    使用方式  props传值  
    // bgcolor  borderColor, color,  url ,disabled
    // 背景颜色， 边框颜色，字体颜色, 跳转的路由, 是否禁用
    // 内容
    // 插槽
    ********************
  -->

  <div
    :style="{
      backgroundColor: bgcolor,
      color,
      borderColor,
    }"
    class="button"
    @click="jumpUrl"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    jumpUrl() {
        // 有传了url再跳转
        if (this.url) {
          this.$router.push(`/${this.url}`);
        }
        // 向父组件发送事件
        this.$emit("btnClick");
    },
  },
  props: ["bgcolor", "url", "borderColor", "color", "disabled"],
};
</script>

<style lang="less" scoped>
.button {
  font-size: 1rem;
  margin: 1rem 0;
  width: 18rem;
  height: 1.68rem;
  border: 0.026667rem solid #e31111;
  display: block;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem 0;
}
</style>
