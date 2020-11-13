<template>
  <div class="box">
    <!-- 音频 -->
    <audio
      @timeupdate="timeUpdate"
      ref="audio"
      class="audio"
      autoplay
      :src="this.songUrl"
      @ended="nextSong"
    ></audio>
    <!-- 头部 -->
    <div class="title" v-if="this.songDefault">
      <div @click="backNextPath" class="left">
        <i class="iconfont iconxiahua"></i>
      </div>
      <div class="middle">
        <div class="songName">
          {{ this.songDefault.name }}
        </div>
        <div class="singerName">
          <!-- 歌手的曲子和搜索的曲子兼容 -->
          <span v-for="item in this.songDefault.artists" :key="item.id">
            {{ item.name }}
          </span>
          <span v-for="item in this.songDefault.ar" :key="item.id">
            {{ item.name }}
          </span>
        </div>
      </div>
      <!--  音量 -->
      <div class="right">
        <div class="volume">
          <div class="top">
            <i class="iconfont iconshengyin"></i>
          </div>
          <div class="bottom">
            <van-slider
              class="slider"
              v-model="volume"
              vertical
              style="margin-left: 100px;"
              @input="volumeInput"
            >
              <!-- 自定义按钮 -->
              <template #button>
                <div class="custom-button"></div>
              </template>
            </van-slider>
          </div>
        </div>
      </div>
    </div>
    <!-- 唱片 -->
    <div class="record">
      <img
        class="rotateing"
        :class="isPlay ? 'running' : 'pause'"
        v-lazy="this.picUrl"
        alt=""
      />
      <!-- <img
        v-else
        class="rotateing"
        :class="isPlay ? 'running' : 'pause'"
        v-lazy="this.songDefault.artists.picUrl"
        alt=""
      /> -->
    </div>
    <!-- 控件 -->
    <div class="controls">
      <div class="top">
        <span class="currentTime">{{ this.currentTime | processingTime }}</span>
        <!-- 进度条 -->
        <van-slider
          @change="changeSlider"
          v-model="percentage"
          active-color="#ee0a24"
          inactive-color="#696560"
          class="slider"
        >
          <template #button>
            <div class="custom-button"></div>
          </template>
        </van-slider>
        <span class="duration">{{ this.duration | processingTime }}</span>
      </div>
      <div class="bottom">
        <!-- 播放方式 -->
        <div class="playWay">
          <i
            @click="changeMode"
            class="iconfont"
            :class="this.mode == 'order' ? 'icon1_music84' : 'icon1_music85'"
          ></i>
        </div>
        <!-- 上一首 -->
        <div @click="previousSong" class="before">
          <i class="iconfont icon1_music83"></i>
        </div>
        <!-- 播放 -->
        <div class="play" @click="play">
          <i
            :class="isPlay ? 'iconzantingtingzhi' : 'iconbofang'"
            class="iconfont"
          ></i>
        </div>
        <!-- 下一首 -->
        <div @click="nextSong" class="next">
          <i class="iconfont icon1_music82"></i>
        </div>
        <!-- 喜欢 -->
        <div class="like">
          <i @click="hrefComments" class="iconfont iconpinglun"></i>
        </div>
      </div>
    </div>
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
      // 当前播放
      currentTime: 0,
      // 歌曲总时间
      duration: 0,
      // 进度条
      percentage: 0,
      // 音量
      volume: 100,
      // 专辑封面
      picUrl: "",
      // 本地playObj
      localPlayObj: {},
    };
  },
  activated() {
    // 获取本地PlayObj缓存
    this.getLocalPlayObj();
    // 获取音乐url
    this.getMusicUrl();
    // 获取专辑(音乐封面)
    this.getAlbum();
    if (this.$refs.audio.src) {
      //load()方法重新加载音频/视频元素
      this.$refs.audio.load();
      // 设置
      // this.currentTime = this.$refs.audio.currentTime;
      if (this.$route.query.currentTime) {
        this.currentTime = this.$route.query.currentTime;
        this.$refs.audio.currentTime = this.currentTime;
      }
      this.duration = this.$refs.audio.duration;
      this.isPlay = true;
    }
  },
  computed: {
    // 播放的歌曲详细信息
    songDefault() {
      // vueX的
      return this.playObj.songList[this.playObj.activeIndex];
    },
    // vueX
    ...mapState(["playObj", "mode"]),
  },
  methods: {
    ...mapMutations([
      "updatePlayObj",
      "previous",
      "next",
      "updateMiniPlay",
      "changeMode",
    ]),
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
    // 获取本地localPlayObj
    getLocalPlayObj() {
      this.localPlayObj = JSON.parse(localStorage.getItem("localPlayObj"));
      // 没有就更新
      if (this.playObj.songList) {
        // 本地更新到vuex
        this.updatePlayObj(this.localPlayObj);
      }
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
      //  设置当前播放时间
      localStorage.setItem("currentTime", this.currentTime + 0.25);
      // 设置音量
      localStorage.setItem("volume", this.volume);
      this.$router.go(-1);
      // 展示迷你播放器
      this.updateMiniPlay();
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
    // 跳转评论功能
    hrefComments() {
      //  设置当前播放时间
      localStorage.setItem("currentTime", this.currentTime + 0.25);
      localStorage.setItem("volume", this.volume);
      this.$router.push(`/comments/${this.songDefault.id}`);
      // // 展示迷你播放器
      this.updateMiniPlay();
    },
    // 进度更新触发
    timeUpdate() {
      this.currentTime = this.$refs.audio.currentTime;
      this.duration = this.$refs.audio.duration;
      this.percentage = (this.currentTime / this.duration) * 100;
    },
    // 修改播放位置
    changeSlider() {
      // 播放的位置 = 拖动后进度条的位置 * 总时长 / 100
      this.$refs.audio.currentTime = (this.percentage * this.duration) / 100;
    },
    // 音量改变
    volumeInput() {
      this.$refs.audio.volume = this.volume / 100;
    },
  },
  filters: {
    // 处理时间
    processingTime(value = 0) {
      if (isNaN(value)) {
        value = 0;
      }
      var second = parseInt(value); // 秒
      var minutes = 0; // 分
      var hour = 0; // 小时

      if (second > 60) {
        minutes = parseInt(second / 60);
        second = parseInt(second % 60);
        if (minutes > 60) {
          hour = parseInt(minutes / 60);
          minutes = parseInt(minutes % 60);
        }
      }
      second = second < 10 ? "0" + second : second;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      if (hour != 0) {
        hour = hour < 10 ? "0" + hour : hour;
        let result = hour + ":" + minutes + ":" + second;
        return result;
      }
      let result = minutes + ":" + second;
      return result;
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #969088;
}
// 头部
.title {
  width: 100vw;
  display: flex;
  color: #fff;
  padding-top: 1rem;
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 700;
    justify-content: center;
    i.iconfont {
      font-size: 20px;
    }
  }

  .middle {
    flex: 6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行

    .songName {
      font-weight: 700;
      font-size: 18px;
    }

    .singerName {
      font-size: 12px;
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    // background-color: pink;
    .volume {
      // background-color: skyblue;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(200, 200, 200, 0.3);
      border-radius: 2rem;
      padding: 1rem 0.3rem 1.5rem;
      // 声音图标
      .top {
        .iconshengyin {
          color: #fff;
          font-size: 18px;
        }
        padding-bottom: 0.5rem;
      }
      .bottom {
        display: flex;
        justify-content: center;
        // 滑块
        .slider {
          // display: none;
          height: 100px;
          margin-left: 0 !important;
          // 自定义按钮
          .custom-button {
            width: 1rem;
            height: 1rem;
            background-color: #fff;
            border-radius: 50%;
          }
        }
      }
    }
  }
}

// 唱片
.record {
  width: 16rem;
  height: 16rem;
  border: 1rem solid rgba(200, 200, 200, 0.3);
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
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
}

// 动画
@keyframes rotating {
  to {
    transform: rotate(360deg);
  }
}

// 控件
.controls {
  width: 100vw;
  height: 5rem;
  padding-bottom: 2rem;
  .top {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    // 当前
    .currentTime {
      color: #fff;
      padding: 0 0.5rem;
    }
    // 滑块
    .custom-button {
      width: 0.4rem;
      height: 0.4rem;
      color: #fff;
      font-size: 10px;
      line-height: 18px;
      text-align: center;
      background-color: #ee0a24;
      border: 0.2rem solid #fff;
      border-radius: 50%;
    }
    // 总时长
    .duration {
      color: #fff;
      padding: 0 0.5rem;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .iconfont {
      color: #f1f1f1;
    }
    .before {
      i.iconfont {
        font-size: 40px;
      }
    }

    .play {
      i.iconfont {
        font-size: 30px;
      }
    }

    .playWay {
      i.iconfont {
        font-size: 30px;
      }
    }
    .next {
      i.iconfont {
        font-size: 40px;
      }
    }
    .like {
      i.iconfont {
        font-size: 25px;
      }
    }
  }
}
</style>
