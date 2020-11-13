<template>
  <!-- 推荐 -->

  <div class="container">
    <!-- 头部 -->
    <app-header  @rightClick="$router.push('/Search')" >
      <i slot="left" class="iconfont icongengduo"></i>
      <div slot="title">JunMusic</div>
      <i slot="right" class="iconfont iconsearch "></i>
    </app-header>
    <!-- 头部切换 -->
    <header-tabbar :tabbarList="tabbarList" />

    <!--  滑动组件 -->
    <scroll
    ref="wrapper"
      class="wrapper"
      :data="personalizedData"
      :pulldown="pulldown"
      @pulldown="loadData"
      :pullup="pullup"
      @scrollToEnd="scrollToEnd"
    >
      <ul class="content">
        <!-- -------- -->
        <li class="title">
          <div class="colorBox"></div>
          <p class="text">推荐歌单</p>
        </li>
        <!-- -------- -->

        <li @click="hrefMusicList(item.id)" class="item" v-for="item in personalizedData" :key="item.id">
          <img class="playListImg" v-lazy="item.picUrl" alt="" />
          <p class="name">{{ item.name }}</p>
          <div class="playCount">
            <i class="iconfont iconerji1"></i>
            <span>{{ item.playCount | playCount }}</span>
          </div>
        </li>

        <!-- -------- -->
        <li class="title">
          <div class="colorBox"></div>
          <p class="text">推荐新音乐</p>
        </li>
        <!-- -------- -->

        <li class="item" v-for="item in newSongData" :key="item.id">
          <img class="playListImg" v-lazy="item.picUrl" alt="" />
          <p class="name">{{ item.name }}</p>
        </li>

        <!-- -------- -->
        <li  class="title">
          <div class="colorBox"></div>
          <p class="text">推荐电台</p>
        </li>
        <!-- -------- -->

        <li @click="hrefRadioList(item.id)" class="item" v-for="item in djprogramData" :key="item.picUrl">
          <img class="playListImg" v-lazy="item.picUrl" alt="" />
          <p class="name">{{ item.name }}</p>
        </li>

        <!-- -------- -->
        <li class="title">
          <div class="colorBox"></div>
          <p class="text">推荐节目</p>
        </li>
        <!-- -------- -->

        <li class="item" v-for="item in recommendData" :key="item.id">
          <img class="playListImg" v-lazy="item.blurCoverUrl" alt="" />
          <p class="name">{{ item.name }}</p>
        </li>
      </ul>
      <div class="loading-wrapper"></div>
    </scroll>
  </div>
</template>

<script>
// 头部
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
          active: true,
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
          active: false,
        },
      ],
      // 获取推荐歌单数据
      personalizedData: [],
      // 推荐歌曲
      newSongData: [],
      // 推荐电台
      djprogramData: [],
      // 推荐节目
      recommendData: [],
      // 下拉是否开启
      pulldown: true,
      // 上拉是否开启
      pullup: true,
    };
  },
  created() {
    // 获取数据
    this.getPersonalized();
    this.getNewsong();
    this.getDjprogram();
    this.getRecommend();
  },
  components: {
    appHeader,
    headerTabbar,
    scroll,
  },
  methods: {
    // 获取推荐歌单，默认 limit 30个
    getPersonalized() {
      this.$http
        .get("/personalized", {
          params: {
            limit: 15,
          },
        })
        .then((res) => {
          // console.log(res.result);
          this.personalizedData = res.result;
        });
    },
    // 获取新音乐，默认 limit 10个
    getNewsong() {
      this.$http
        .get("/personalized/newsong", {
          params: {
            limit: 9,
          },
        })
        .then((res) => {
          // console.log(res.result);
          this.newSongData = res.result;
        });
    },
    // 推荐电台
    getDjprogram() {
      this.$http.get("/personalized/djprogram").then((res) => {
        // console.log(res.result);
        this.djprogramData = res.result;
      });
    },
    // 推荐节目
    getRecommend() {
      this.$http.get("/program/recommend").then((res) => {
        // console.log(res.programs);
        this.recommendData = res.programs;

        // 初始化滚动条
       this.initScroll();
      });
    },
    // 下拉重新获取数据
    loadData() {
      console.log("下拉");
    },
    // 上拉加载
    scrollToEnd() {
      console.log("上拉");
    },
    // 跳转到歌单详情 MusicList
    hrefMusicList(id){
      this.$router.push(`/MusicList/${id}`);
    },
    // 跳转到电台详情 RadioList
    hrefRadioList(id){
      this.$router.push(`/RadioList/${id}`);
    },
    // 初始化滚动条
    initScroll() {
      // 初始化滚动条
      setTimeout(() => {
        this.$refs.wrapper._initScroll();
      }, 20);
    },
  },
  filters: {
    /* 格式化播放量 */
    playCount(val) {
      return `${val.toString().slice(0, 2)}.${val.toString().slice(2, 3)}万`;
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
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.5rem;
    padding-bottom: 4rem;
    .title {
      width: 100%;
      font-weight: 700;
      height: 3rem;
      font-size: 1rem;
      display: flex;
      align-items: center;
      .colorBox {
        width: 0.3rem;
        height: 1.5rem;
        background-color: #ec4036;
      }
      .text {
        margin-left: 0.3rem;
      }
    }
    .item {
      width: 32%;
      /*       width: 120px; */
      position: relative;
      padding-bottom: 0.8rem;
      // 歌单图片
      .playListImg {
        width: 100%;
        height: 120px;
        border-radius: 5px;
      }
      .name {
        font-size: 0.7rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .playCount {
        position: absolute;
        right: 0.3rem;
        top: 0.1rem;
        color: #ffffff;
        font-size: 0.5rem;
        .iconerji1 {
          font-size: 0.5rem;
          margin-right: 0.1rem;
        }
      }
    }
  }
}
</style>
