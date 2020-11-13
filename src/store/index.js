import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户 uid
    uid: '',
    // 播放对象
    playObj: {
      // 歌曲列表
      songList: [],
      // 当前播放索引
      activeIndex: 0,
      // 是否使用小播放器
      miniIsPlay: false
    },
    // 用户详情
    profile: {
      // 用户的头像，背景，名称，uid
    },
    // 上一首索引
    previousIndex: 0,
    // 播放模式(默认顺序播放)
    mode: 'order'
  },
  mutations: {
    //更新 PlayObj 播放对象 
    updatePlayObj(state, newPlayObj) {
      state.playObj = newPlayObj;
    },
    //更新 profile 用户信息
    updateProfile(state, newProfileObj) {
      state.profile = newProfileObj;
    },
    // 展示或者隐藏迷你播放器
    updateMiniPlay(state) {
      state.playObj.miniIsPlay = !state.playObj.miniIsPlay;
      console.log(state.playObj);
    },
    // 上一首
    previous(state, length) {
      if (state.playObj.activeIndex !== 0) {
        state.playObj.activeIndex--;
      } else {
        state.playObj.activeIndex = length - 1;
      }
      // 本地存储这个playObj, 如果播放组件刷新没了 vuex 用本地的
      localStorage.setItem("localPlayObj", JSON.stringify(state.playObj));
    },
    // 下一首
    next(state, length) {
      if (state.mode == 'order') {
        // 循序播放
        if (state.playObj.activeIndex == length - 1) {
          state.playObj.activeIndex = 0;
        } else {
          state.playObj.activeIndex++;
        }
        console.log(state.playObj.activeIndex, length);
      }else {
        // 随机播放 生成随机数
        state.playObj.activeIndex = Math.floor(Math.random()*(length));
      }
       // 本地存储这个playObj, 如果播放组件刷新没了 vuex 用本地的
       localStorage.setItem("localPlayObj", JSON.stringify(state.playObj));
    },
    // 改变播放模式
    changeMode(state) {
      if (state.mode == 'order') {
        state.mode = 'random';
      } else {
        state.mode = 'order';
      }
    }
  },
  actions: {},
  modules: {}
})