<template>
  <div>
    <div class="box">
      <div class="title">
        <i @click="$router.go(-1)" class="iconfont iconkuohao"></i>
        <span>歌单</span>
      </div>
    </div>

    <scroll
      ref="wrapper"
      class="wrapper"
      :pulldown="pulldown"
      @pulldown="loadData"
      :pullup="pullup"
      @scrollToEnd="scrollToEnd"
    >
      <ul class="content">
        <!-- 封面 -->
        <!-- 懒加载 -->
        <li
          v-if="this.musicList.coverImgUrl"
          class="cover"
          v-lazy:background-image="this.musicList.coverImgUrl"
        >
          <div class="info">
            <div class="text">
              {{ this.musicList.name }}
            </div>
            <div class="playCount">
              <i class="iconfont iconerji1"></i>
              <span> {{ this.musicList.playCount | playCount }}</span>
            </div>
          </div>
        </li>

        <!-- 全部播放 -->
        <li class="playAll" @click="herfPlayMusic(0)">
          <div class="left">
            <i class="iconfont iconbofang1"></i>
          </div>
          <div class="right">
            <p v-if="this.songs[0]">
              播放全部<span>(共{{ this.songs.length }}首)</span>
            </p>
          </div>
        </li>

        <!-- 项目 -->
        <li
          class="item"
          v-for="(item1, i1) in this.songs"
          :key="item1.id"
          @click="herfPlayMusic(i1)"
        >
          <div class="left">
            {{ i1 + 1 }}
          </div>
          <div class="right">
            <div class="top">
              {{ item1.name }}
            </div>
            <div class="bottom">
              <span v-for="item2 in item1.ar" :key="item2.name">
                {{ item2.name }}
              </span>
            </div>
          </div>
        </li>
      </ul>
      <div class="loading-wrapper"></div>
    </scroll>
  </div>
</template>

<script>
// better scroll 滑动组件
import scroll from "@/components/common/scroll.vue";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      // 歌单详情
      musicList: [],
      // 下拉是否开启
      pulldown: true,
      // 上拉是否开启
      pullup: true,
      // 音乐id 字符串
      musicIdStr: [],
      // 歌曲详情
      songs: [],
    };
  },
  // keepAlive 缓存时候调用
  activated() {
    this.getPlaylistDetail();
  },
  methods: {
    ...mapMutations(["updatePlayObj"]),
    // 获取歌单详情
    getPlaylistDetail() {
      let url = "/playlist/detail";
      this.$http(url, {
        params: {
          id: this.$route.params.id,
        },
      }).then((res) => {
        console.log(res.playlist);
        this.musicList = res.playlist;

        // 处理全部歌单音乐id
        let IdArray = [];
        res.playlist.trackIds.forEach((item) => {
          // id 小于100首
          if (item.id) {
            IdArray.push(item.id);
          }
        });
        // 处理音乐Id变成字符串
        this.musicIdStr = IdArray.join(",");

        // 获取音乐详情
        this.getSongDetail();
      });
    },
    // 获取歌曲详情使用全部id去请求
    getSongDetail() {
      this.$http("/song/detail", {
        params: {
          ids: this.musicIdStr,
        },
      }).then((res) => {
        this.songs = res.songs;
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
    // 跳转播放组件
    herfPlayMusic(i) {
      let newPlayObj = {
        songList: this.musicList.tracks,
        activeIndex: i,
        miniIsPlay: false,
      };
      // 本地存储这个playObj, 如果播放组件刷新没了 vuex 用本地的
      localStorage.setItem("localPlayObj", JSON.stringify(newPlayObj));
      // 更新 playObj
      this.updatePlayObj(newPlayObj);
      // 跳转播放页面
      this.$router.push("/playMusic");
    },
    // 初始化滚动条
    initScroll() {
      // 初始化滚动条
      setTimeout(() => {
        this.$refs.wrapper._initScroll();
      }, 20);
    },
  },
  // 模板
  components: {
    scroll,
  },
  // 过滤
  filters: {
    /* 格式化播放量 */
    playCount(val) {
      let val1 = val + "";
      return `${val1.slice(0, 2)}.${val1.slice(2, 3)}万`;
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  width: 100vw;
  /*   background-color: pink; */
  height: 2rem;
  line-height: 2rem;
  padding: 0 0.5rem;
  position: fixed;
  top: 0.2rem;
  left: 0;
  z-index: 9;
  .title {
    color: #fff;
    .iconkuohao {
      font-weight: 700;
    }

    span {
      padding-left: 0.5rem;
    }
  }
}
.wrapper {
  height: 100vh;
  overflow: hidden;
  // background-color: pink;
  .content {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    .cover {
      width: 100vw;
      height: 18rem;
      background-size: cover;
      background-repeat: no-repeat;
      color: #ffffff;
      position: relative;

      .info {
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        .text {
          font-weight: 700;
          text-overflow: ellipsis;

          overflow: hidden;

          white-space: nowrap;
        }
        .playCount {
          font-size: 12px;
        }
      }
    }
    .playAll {
      background-color: #f2f3f4;
      height: 2.8rem;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      border-radius: 10px 10px 0px 0px;
      position: relative;
      top: -0.6rem;
      left: 0;
      border-bottom: 1px solid #e7e7e7;
      .left {
        i.iconfont.iconbofang1 {
          font-size: 18px;
        }
      }

      .right {
        padding-left: 0.8rem;
        p {
          font-size: 16px;
          span {
            color: #9a9a9a;
            font-size: 14px;
          }
        }
      }
    }
    .item {
      position: relative;
      top: -0.6rem;
      left: 0;
      display: flex;
      height: 3.5rem;
      background-color: #f2f3f4;
      border-bottom: 1px solid #e7e7e7;
      .left {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .top {
          font-size: 16px;
        }

        .bottom {
          span {
            font-size: 12px;
            color: #8b8b8b;
            text-overflow: ellipsis;

            overflow: hidden;

            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
