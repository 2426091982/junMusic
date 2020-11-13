<template>
  <div v-if="this.playObj.miniIsPlay && this.songDefault" class="mini_player">
    <div class="left" @click="hrefPlayMusic">
      <img
        class="rotateing"
        :class="isPlay ? 'running' : 'pause'"
        v-lazy="this.picUrl"
        alt=""
      />
    </div>
    <div class="middle" @click="hrefPlayMusic">
      <div class="top">{{ this.songDefault.name }}</div>
      <div class="bottom">
        <!-- 歌手的曲子和搜索的曲子兼容 -->
        <span v-for="item in this.songDefault.artists" :key="item.id">
          {{ item.name }}
        </span>
        <span v-for="item in this.songDefault.ar" :key="item.id">
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="right">
      <!-- 上一首 -->
      <div @click="previousSong" class="before">
        <i class="iconfont icon1_music83"></i>
      </div>
      <div @click="play" class="player">
        <i
          :class="isPlay ? 'iconzantingtingzhi' : 'iconbofang'"
          class="iconfont"
        ></i>
      </div>
      <!-- 下一首 -->
      <div @click="nextSong" class="next">
        <i class="iconfont icon1_music82"></i>
      </div>
    </div>
    <audio
      ref="audio"
      class="audio"
      autoplay
      :src="this.songUrl"
      @ended="nextSong"
    ></audio>
  </div>
</template>

<script>
// Vuex
import { mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      // 歌曲url
      songUrl: "",
      isPlay: true,
      // 专辑封面
      picUrl: "",
      // 是否展示
      isShow: true,
      // 当前播放时间
      currentTime: 0,
      // 音量
      volume: 1,
    };
  },
  mounted() {},
  watch: {
    //使用watch 监听$router的变化
    $route(to, from) {
      if (from.meta.index == 999) {
        // 获取音乐url
        this.getMusicUrl();
        // 获取专辑(音乐封面)
        this.getAlbum();
        console.log(1);
        if (this.$refs.audio.src) {
          //load()方法重新加载音频/视频元素
          this.$refs.audio.load();
          this.isPlay = true;
          // 设置播放时间
          this.currentTime = localStorage.getItem("currentTime");
          this.$refs.audio.currentTime = this.currentTime;

          // 设置音量
          this.volume = localStorage.getItem("volume");
          this.$refs.audio.volume = this.volume / 100;
        }
      }
    },
  },
  computed: {
    // 播放的歌曲详细信息
    songDefault() {
      console.log(this.playObj.songList[this.playObj.activeIndex]);
      // vueX的
      return this.playObj.songList[this.playObj.activeIndex];
    },
    // vueX
    ...mapState(["playObj"]),
  },
  methods: {
    ...mapMutations(["updatePlayObj", "previous", "next", "updateMiniPlay"]),
    // 获取音乐 url
    getMusicUrl() {
      let url = "/song/url";
      this.$http(url, {
        params: {
          id: this.songDefault.id,
        },
      }).then((res) => {
        this.songUrl = res.data[0].url;
      });
    },
    // 获取专辑详情(目的获取专辑封面)
    getAlbum() {
      this.$http("/song/detail", {
        params: {
          ids: this.songDefault.id,
        },
      }).then((res) => {
        this.picUrl = res.songs[0].al.picUrl;
        console.log(this.picUrl);
      });
    },
    // 返回上一层路径
    backNextPath() {
      this.$router.go(-1);
    },
    // 上一首
    previousSong() {
      // 上一首
      this.previous(this.playObj.songList.length);
      // 获取音乐url
      this.getMusicUrl();
      // 获取专辑(音乐封面)
      this.getAlbum();
    },
    // 下一首
    nextSong() {
      // 下一首
      this.next(this.playObj.songList.length);
      // 获取音乐url
      this.getMusicUrl();
      // 获取专辑(音乐封面)
      this.getAlbum();
    },
    // 播放/暂停
    play() {
      if (!this.isPlay) {
        // 播放
        this.$refs.audio.play();
      } else {
        // 暂停
        this.$refs.audio.pause();
      }
      // 取反
      this.isPlay = !this.isPlay;
    },
    hrefPlayMusic() {
      this.$router.push({
        path: "/playMusic",
        query: { currentTime: this.$refs.audio.currentTime + 0.25 },
      });
      // 隐藏迷你播放器
      this.updateMiniPlay();
    },
  },
};
</script>

<style lang="less" scoped>
// 迷你播放器

.mini_player {
  box-sizing: border-box;
  width: 100vw;
  height: 4rem;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  padding: 0.5rem;
  .left {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      border-radius: 50%;
      width: 45px;
      height: 45px;
    }
    // 旋转
    .rotateing {
      animation: rotating 10s linear infinite;
    }
    // 暂停
    .pause {
      animation-play-state: paused;
    }
    // 播放
    .running {
      animation-play-state: running;
    }

    // 动画
    @keyframes rotating {
      to {
        transform: rotate(360deg);
      }
    }
  }

  .middle {
    flex: 6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .top {
    }

    .bottom {
      font-size: 12px;
      color: #2e3030;
    }
  }

  .right {
    flex: 4;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .player {
      .iconfont {
        font-size: 20px;
      }
    }

    .before {
      .iconfont {
        font-size: 20px;
      }
    }
    .next {
      .iconfont {
        font-size: 20px;
      }
    }
  }
}
</style>
