<template>
  <!-- 排行 -->
  <div>
    <!-- 头部 -->
    <app-header @rightClick="$router.push('/Search')">
      <i slot="left" class="iconfont icongengduo"></i>
      <div slot="title">JunMusic</div>
      <i slot="right" class="iconfont iconsearch "></i>
    </app-header>
    <!-- 头部切换 -->
    <header-tabbar :tabbarList="tabbarList"> </header-tabbar>
    <!--  滑动组件 -->
    <scroll
      ref="wrapper"
      class="wrapper"
      :pulldown="pulldown"
      @pulldown="loadData"
      :pullup="pullup"
      @scrollToEnd="scrollToEnd"
    >
      <ul class="content">
        <li class="title">
          <span>热门</span>
        </li>
        <li
          @click="hrefsingerSongList(item.id, item.picUrl, item.name)"
          class="item"
          v-for="item in singerList"
          :key="item.id"
        >
          <div class="box">
            <div class="left">
              <img v-lazy="item.picUrl" alt="" />
            </div>
            <div class="right">
              <span>{{ item.name }}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="loading-wrapper"></div>
    </scroll>
  </div>
</template>

<script>
import appHeader from "@/components/common/appHeader.vue";
// 头部切换
import headerTabbar from "@/components/common/headerTabbar.vue";
// better scroll 滑动组件
import scroll from "@/components/common/scroll.vue";
export default {
  data() {
    return {
      // 切换数据
      tabbarList: [
        {
          id: 0,
          title: "我的",
          path: "/user",
          active: false,
        },
        {
          id: 1,
          title: "推荐",
          path: "/Recommend",
          active: false,
        },
        {
          id: 2,
          title: "排行",
          path: "/Rank",
          active: false,
        },
        {
          id: 3,
          title: "歌手",
          path: "/Singer",
          active: true,
        },
      ],
      // 下拉是否开启
      pulldown: true,
      // 上拉是否开启
      pullup: true,
      // 热门歌手
      singerList: [],
    };
  },
  components: {
    appHeader,
    headerTabbar,
    scroll,
  },
  activated() {
    // 获取数据
    this.getSinger();
  },
  methods: {
    // 获取排行榜单
    getSinger() {
      // 如果本地存储有数据
      if (localStorage.getItem("singerList")) {
        // 取出本地的
        let singerList = localStorage.getItem("singerList");
        this.singerList = JSON.parse(singerList);
        // console.log(singerList);
        console.log("本地的");
        // 初始化滚动条
          this.initScroll();
        return;
      }
      console.log("请求");
      // 没有就请求
      this.$http
        .get("/toplist/artist", {
          params: {
            type: 1,
          },
        })
        .then((res) => {
          // 赋值，
          this.singerList = res.list.artists;
          console.log(res);
          // 保存到本地存储
          localStorage.setItem("singerList", JSON.stringify(this.singerList));
          // console.log(this.singerList);
          // 初始化滚动条
          this.initScroll();
        });
    },
    // 跳转到歌手热门50首
    hrefsingerSongList(id, picUrl, name) {
      this.$router.push(`/singerSongList/${id}?picUrl=${picUrl}&name=${name}`);
    },
    // 下拉重新获取数据
    loadData() {
      console.log("下拉");
    },
    // 上拉加载
    scrollToEnd() {
      console.log("上拉");
    },
    // 初始化滚动条
    initScroll() {
      setTimeout(() => {
        this.$refs.wrapper._initScroll();
      }, 20);
    },
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  overflow: hidden;
  // background-color: pink;
  .content {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;

    .title {
      background-color: #d9dadb;
      color: #fff;
      line-height: 1.2rem;
      height: 1.2rem;
      font-size: 6px;
      padding-left: 1rem;
    }
    .item {
      padding: 0 0.5rem;
      border-bottom: 1px solid #e4e4e4;
      .box {
        display: flex;
        height: 4rem;
        align-items: center;
        div.left {
          img {
            width: 3rem;
            height: 3rem;
            border-radius: 0.2rem;
          }
        }

        div.right {
          padding-left: 1.7rem;
          span {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
