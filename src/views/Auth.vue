<template>
  <!-- 选择登录界面 -->
  <div class="auth">
    <div class="view">
      <div class="logo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <cloud-button url="Login" color="#e31111">
        手机号登录
      </cloud-button>
      <cloud-button url="Register" color="#e31111">
        注册
      </cloud-button>
    </div>
  </div>
</template>

<script>
// 导入按钮组件
import cloudButton from "@/components/common/cloudButton";
export default {
  data() {
    return {
      goToLogin() {},
    };
  },
  components: {
    // 按钮组件
    cloudButton,
  },
};
</script>

<style lang="less" scoped>
.auth {
  background: url("../assets/bg.jpeg") no-repeat;
  background-color: #f3eae5;
  background-size: contain;
  background-position: 0 15rem;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .view {
    margin-bottom: 7rem;
    // logo
    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 4rem;
      img {
        width: 5rem;
        height: 5rem;
      }
    }
    // 按钮
    .button-auth {
      font-size: 1rem;
      margin: 1rem 0;
      width: 18rem;
      height: 1.68rem;
      border: 0.026667rem solid #e31111;
      display: block;
      color: #e31111;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.233333rem 0;
    }
  }
}
</style>
