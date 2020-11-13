<template>
  <!-- 手机号注册界面 -->
  <div class="register">
    <!-- 登录头部 -->
    <app-header @leftClick="leftClick">
      <!-- 图标 -->
      <i class="iconfont iconkuohao" slot="left"></i>
      <div slot="title">手机号注册</div>
    </app-header>

    <!-- 输入框 -->
    <van-cell-group>
      <van-field
        label="昵称"
        v-model="nickname"
        left-icon="user-o"
        placeholder="输入昵称"
        label-width="30px"
        clearable
        autofocus
      />
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
        placeholder="设置登录密码，不少于6位"
      />
    </van-cell-group>
    <!-- 按钮组件 -->
    <cloud-button
      @btnClick="next"
      class="nextBtn"
      :color="this.color"
      bgcolor="#ec4036"
      borderColor="#ec4036"
    >
      <span>下一步</span>
    </cloud-button>
  </div>
</template>

<script>
// 按钮组件
import cloudButton from "@/components/common/cloudButton.vue";
// 头部组件
import appHeader from "@/components/common/appHeader.vue";
// 导入vant通知模块
import { Notify } from "vant";
export default {
  data() {
    return {
      // 手机号
      tel: "",
      // 密码
      password: "",
      // 昵称
      nickname: ""
    };
  },
  methods: {
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
      if (this.testTel() && this.testPassword()) {
        // 验证手机号是否注册
        this.$http
          .get("/cellphone/existence/check", {
            params: {
              phone: this.tel,
            },
          })
          .then((res) => {
            // 已经注册
            if (res.exist === 1) {
              Notify({
                message: "该账号已经注册，请登录",
                color: "#ec4036",
                background: "#fff",
              });
              // 跳转到登录页面
              this.$router.push("/Login");
            }

            // 没有注册
            if (res.exist === -1) {
              // 发送验证码
              this.$http
                .get("/captcha/sent", {
                  params: {
                    phone: this.tel,
                  },
                })
                .then((res) => {
                  if (res.code === 200) {
                    // 跳转路由
                    this.$router.push({
                      path: "/checkCode",
                      query: {
                        // 手机号
                        tel: this.tel,
                        // 密码
                        password: this.password,
                        // 昵称
                        nickname: this.nickname
                      },
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
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
      // 路由后退
      this.$router.go(-1);
    },
  },
  components: {
    cloudButton,
    appHeader,
  },
  computed: {
    // 判断是否填写表单
    isFill() {
      return this.tel.trim().length && this.password.trim().length;
    },
    // 按钮字体禁用样式
    color() {
      return this.isFill ? "#fff" : "#ccc";
    },
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

.register {
  width: 100vw;
  height: 100vh;
  background-color: #fafcfe;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
