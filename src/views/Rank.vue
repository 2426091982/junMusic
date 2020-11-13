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
        <li
          @click="hrefMusicList(item1.id)"
          class="item"
          v-for="item1 in rankList"
          :key="item1.id"
        >
          <!-- 左边 -->
          <div class="left">
            <!-- 歌单图片 -->
            <img v-lazy="item1.coverImgUrl" alt="" />
          </div>
          <!-- 右边 -->
          <div class="right">
            <ul>
              <!-- 前三歌曲 -->
              <div v-if="item1.tracks.length !== 0">
                <li class="title" v-for="(item2, i2) in item1.tracks" :key="i2">
                  <span v-if="item2.first">
                    {{ i2 + 1 + "." + item2.first + "-" + item2.second }}
                  </span>
                </li>
              </div>
              <!-- 没有数据的用假数据代替 -->
              <div v-else>
                <li v-for="(item2, i2) in tracks2" :key="i2">
                  <span v-if="item2.first">
                    {{ i2 + 1 + "." + item2.first + "-" + item2.second }}
                  </span>
                </li>
              </div>
            </ul>
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
          active: true,
        },
        {
          id: 3,
          title: "歌手",
          path: "/Singer",
          active: false,
        },
      ],
      // 下拉是否开启
      pulldown: true,
      // 上拉是否开启
      pullup: true,
      // 歌曲排行
      rankList: [],
      // 代替没有排行的歌曲
      tracks2: [
        {
          first: "暂定",
          second: "未定歌手",
        },
        {
          first: "暂定",
          second: "未定歌手",
        },
        {
          first: "暂定",
          second: "未定歌手",
        },
      ],
    };
  },
  components: {
    appHeader,
    headerTabbar,
    scroll,
  },
  mounted() {
    // 获取数据
    this.getTop();
  },
  methods: {
    // 获取排行榜单
    getTop() {
      this.$http.get("/toplist/detail").then((res) => {
        this.rankList = res.list;
        // console.log(this.rankList);
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
    hrefMusicList(id) {
      this.$router.push(`/MusicList/${id}`);
    },
    // 初始化滚动条
    initScroll() {
      // 初始化滚动条
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
    padding: 0 0.5rem;
    .item {
      display: flex;
      border-bottom: 1px solid #e4e4e4;
      padding-top: 0.5rem;
      .left {
        img {
          width: 6rem;
          height: 6rem;
          border-radius: 0.2rem;
        }
      }

      .right {
        flex: 1;
        ul {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          li {
            height: 1.5rem;
            padding-left: 1rem;
            font-size: 12px;
           
            span {
               overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
