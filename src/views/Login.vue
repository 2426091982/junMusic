<template>
  <!-- 手机号登录界面 -->
  <div class="Login">
    <!-- 登录头部 -->
    <app-header @leftClick="leftClick">
      <!-- 图标 -->
      <i class="iconfont iconkuohao" slot="left"></i>
      <div slot="title">手机号登录</div>
    </app-header>

    <van-cell-group>
      <van-field
        label="+86"
        v-model="tel"
        left-icon="phone-o"
        placeholder="输入手机号"
        label-width="30px"
        clearable
        autofocus
      />
      <van-field
        v-model="password"
        clearable
        label="密码"
        left-icon="closed-eye"
        label-width="30px"
        placeholder="输入登录密码"
      />
    </van-cell-group>
    <cloud-button
      @btnClick="next"
      class="nextBtn"
      color="#fff"
      bgcolor="#ec4036"
      borderColor="#ec4036"
    >
      <span>登录</span>
    </cloud-button>
  </div>
</template>

<script>
import cloudButton from "@/components/common/cloudButton.vue";
import appHeader from "@/components/common/appHeader.vue";
// 导入vueX
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      // 手机号
      tel: "13392484588",
      // 密码
      password: "wht25672559160",
    };
  },
  methods: {
    ...mapMutations(['updateProfile']),

    // 验证手机号
    testTel() {
      return /^1[35789]\d{9}$/.test(this.tel);
    },
    // 验证密码
    testPassword() {
      return this.password.trim().length >= 6;
    },
    // 点击下一步
    next() {
      // 检查密码手机号
      if (this.testTel() && this.testPassword()) {
        // 登录
        this.loginCellphone({
          phone: this.tel,
          password: this.password,
        }).then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.updateProfile(res.profile);
            // 设置本地存储
            localStorage.setItem('userInfo',JSON.stringify(res.profile))
            // 登录成功跳转推荐首页
            // this.$router.push('/Recommend');
            // 测试用户页面
            this.$router.push('/user');
          }
        });
      } else {
        // 消息通知
        Notify({
          message: "请输入合法的手机号或密码！",
          color: "#ec4036",
          background: "#fff",
        });
      }
    },
    // 点击头部组件左侧按钮
    leftClick() {
      console.log(1);
      // 路由后退
      this.$router.go(-1);
    },
    // 手机登录
    loginCellphone(params) {
      return this.$http("/login/cellphone", {
        params,
      });
    },
  },
  components: {
    cloudButton,
    appHeader,
  },
};
</script>

<style lang="less" scoped>
.van-cell-group {
  width: 100%;
  background: none !important;
}
.van-cell {
  width: 100% !important;
  background: none !important;
}

.Login {
  width: 100vw;
  height: 100vh;
  background-color: #fafcfe;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
