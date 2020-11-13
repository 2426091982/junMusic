<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive>
        <router-view class="view"></router-view>
      </keep-alive>
    </transition>
    <!-- 迷你播放器 -->
    <miniPlayer />
  </div>
</template>

<script>

// 导入迷你播放器组件
import miniPlayer from '@/components/common/miniPlayer.vue';

export default {
  name: "App",
  data() {
    return {
      // 过渡名字
      transitionName: "",
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
    };
  },
  watch: {
    //使用watch 监听$router的变化
    $route(to, from) {
      if (to.meta.index == 0 && from.meta.index == 0) {
        this.transitionName = "";
        return;
      }

      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = "slide-left";
      } else {
        this.transitionName = "slide-right";
      }

      // 播放列表是上下切换动画
      if (to.meta.index === 999) {
        //设置动画名称
        this.transitionName = "slide-top";
      } else if (from.meta.index === 999) {
        this.transitionName = "slide-bottom";
      }
    },
  },
  components:{
    miniPlayer,
  }
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: #000;
}

.view {
  width: 100%;
  position: absolute;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-top-enter-active,
.slide-top-leave-active,
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  will-change: transform;
  transition: all 250ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-top-enter {
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}
.slide-top-leave-active {
  opacity: 1;
  transform: translate3d(0, -100%, 0);
}
.slide-bottom-enter {
  opacity: 0;
  transform: translate3d(0, -100%, 0);
}
.slide-bottom-leave-active {
  opacity: 1;
  transform: translate3d(0, 100%, 0);
}


</style>
