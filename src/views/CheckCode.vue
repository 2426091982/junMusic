<template>
  <!-- 验证码界面 -->
  <div>
    <!-- 头部组件 -->
    <app-header @leftClick="leftClick">
      <!-- 图标 -->
      <i class="iconfont iconkuohao" slot="left"></i>
      <!-- 标题 -->
      <div slot="title">手机号验证</div>
    </app-header>
    <!-- 验证码页面  -->
    <div class="checkCode">
      <!-- 手机号提示 -->
      <div class="checkCode_message">
        <div>你的手机号：+86 {{ $route.query.tel | toPrivacy }}</div>
        <div>你会收到一条带有验证码的短信，请输入验证码</div>
      </div>
      <!-- 验证码 -->
      <div class="code_warp">
        <div class="code_item" v-for="(item, i) in captchaList" :key="i">
          {{ item }}
        </div>
      </div>
      <!-- 隐藏的input -->
      <input
        ref="captchaInputArea"
        maxlength="4"
        class="captchaInput"
        v-model="captcha"
        type="tel"
      />
      <!-- 倒计时 -->
      <div class="countdown">
        56S
      </div>
    </div>
  </div>
</template>

<script>
// 导入头部组件
import appHeader from "@/components/common/appHeader.vue";
export default {
  data() {
    return {
      captcha: "",
      captchaList: ["", "", "", ""],
    };
  },
  components: {
    appHeader,
  },
  methods: {
    // 返回上一页
    leftClick() {
      this.$router.go(-1);
    },
    // 注册(修改密码)
    registerCellphone(params) {
      return this.$http.get("/register/cellphone", {
        params,
      });
    },
  },
  mounted() {
    // 获取焦点
    this.$refs.captchaInputArea.focus();
  },
  watch: {
    captcha(newV, oldV) {
      // 先清空
      this.captchaList = ["", "", "", ""];
      // 再填充
      Object.assign(this.captchaList, [...newV]);
      if (newV.length === 4) {
        console.log("请求注册接口");
        // 注册(修改密码)
        this.registerCellphone({
          // 手机号
          phone: this.$route.query.tel,
          // 验证码
          captcha: this.captcha,
          // 密码
          password: this.$route.query.password,
          // 初始化昵称
          nickname: this.$route.query.nickname
        }).then((res) => {
          console.log(res);
        });
      }
    },
  },
  filters: {
    // 手机号中间用 * 代替
    toPrivacy(value) {
      return value
        .split("")
        .map((value, index) => {
          if (index > 2 && index < 7) {
            return "*";
          } else {
            return value;
          }
        })
        .join("");
    },
  },
};
</script>

<style lang="less" scoped>
.checkCode {
  width: 100vw;
  height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 0 0.5rem;
  .checkCode_message {
    padding-top: 0.866667rem;
    color: #969798;
    font-size: 0.9rem;
  }

  .code_warp {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    .code_item {
      width: 2.8rem;
      height: 2.8rem;
      font-size: 1.5rem;
      line-height: 2.8rem;
      text-align: center;
      border-bottom: 1px solid #ccc;
    }
  }
  // 隐藏输入框
  .captchaInput {
    width: 0;
    height: 0;
    border: none;
    outline: none;
  }
  .countdown {
    color: #797979;
    font-size: 0.8rem;
    align-self: flex-end;
    margin-right: 1rem;
    margin-top: 1rem;
  }
}
</style>
