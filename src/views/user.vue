<template>
  <div class="box">
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
        <!-- 用户信息 -->
        <li v-if="this.userInfo.avatarUrl" class="userInfo">
          <div class="avatar">
            <img :src="this.userInfo.avatarUrl" alt="" />
          </div>
          <div class="info">
            <div class="left">
              <div class="name">{{ this.userInfo.nickname }}</div>
              <i class="level">Lv.7</i>
            </div>
            <div class="right">
              <i class="iconfont iconarrow-left"></i>
            </div>
          </div>
        </li>
        <!-- 用户信息 未登录 -->
        <li v-else class="userInfo">
          <div class="avatar">
            <img src="@/assets/login.jpg" alt="" />
          </div>
          <div @click="$router.push('/auth')" class="info">
            <div class="left">
              <div class="name">未登录</div>
              <i class="level">Lv.0</i>
            </div>
            <div class="right">
              <i class="iconfont iconarrow-left"></i>
            </div>
          </div>
        </li>

        <!-- 音乐应用 -->
        <li class="application">
          <ul class="list">
            <li class="item">
              <i class="iconfont iconB-xiazai"></i>
              <span>本地音乐</span>
            </li>
            <li class="item">
              <i class="iconfont iconyunpan"></i>
              <span>云盘</span>
            </li>
            <li class="item">
              <i
                class="iconfont iconquerenyuanzhengqueduigoutijiaochenggongwancheng"
              ></i>
              <span>已购</span>
            </li>
            <li class="item">
              <i class="iconfont iconbofang2"></i>
              <span>最近播放</span>
            </li>
            <li class="item">
              <i class="iconfont iconhaoyou"></i>
              <span>我的好友</span>
            </li>
            <li class="item">
              <i class="iconfont iconshoucang"></i>
              <span>收藏和赞</span>
            </li>
            <li class="item">
              <i class="iconfont icondiantai"></i>
              <span>我的电台</span>
            </li>
            <li class="item">
              <i class="iconfont iconwenjianjia"></i>
              <span>音乐应用</span>
            </li>
          </ul>
        </li>

        <!-- 我喜欢的音乐 -->
        <li
          @click="hrefMusicList(favouriteList.id)"
          v-if="this.favouriteList.id"
          class="favourite"
        >
          <div class="left">
            <div class="img">
              <img v-lazy="this.favouriteList.coverImgUrl" alt="" />
            </div>
          </div>
          <div class="middle">
            <div class="top">我喜欢的音乐</div>
            <div class="bottom">{{ this.favouriteList.trackCount }}首</div>
          </div>
          <div class="right">
            <!-- 播放模式 -->
            <div class="model">
              <i class="iconfont icon1_music89"></i>
              <span>心动模式</span>
            </div>
          </div>
        </li>

        <!-- 创建歌单，收藏歌单切换 -->
        <van-tabs class="tabbar" v-model="active" background="none"  line-width="50px" swipeable @change="changeTabbar">
          <van-tab title="创建歌单">
            <ul class="userPlayList">
              <li
                @click="hrefMusicList(item.id)"
                v-for="item in this.createList"
                :key="item.id"
                class="item"
              >
                <div class="left">
                  <div class="img">
                    <img v-lazy="item.coverImgUrl" alt="" />
                  </div>
                </div>
                <div class="middle">
                  <div class="top">{{ item.name }}</div>
                  <div class="bottom">{{ item.trackCount }}首</div>
                </div>
                <div class="right">
                  <i class="iconfont icongengduo1"></i>
                </div>
              </li>
            </ul>
          </van-tab>
          <van-tab title="收藏歌单">
            <ul class="userPlayList">
              <li
                @click="hrefMusicList(item.id)"
                v-for="item in this.collectList"
                :key="item.id"
                class="item"
              >
                <div class="left">
                  <div class="img">
                    <img v-lazy="item.coverImgUrl" alt="" />
                  </div>
                </div>
                <div class="middle">
                  <div class="top">{{ item.name }}</div>
                  <div class="bottom">{{ item.trackCount }}首</div>
                </div>
                <div class="right">
                  <i class="iconfont icongengduo1"></i>
                </div>
              </li>
            </ul>
          </van-tab>
        </van-tabs>
      </ul>
      <div class="loading-wrapper"></div>
    </scroll>
  </div>
</template>

<script>
// 导入 vueX
import { mapMutations, mapState } from "vuex";
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
          active: true,
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
          active: false,
        },
      ],
      // 下拉是否开启
      pulldown: true,
      // 上拉是否开启
      pullup: true,
      // 用户歌单
      playList: [],
      // 用户创建歌单
      createList:[],
      // 用户收藏歌单
      collectList:[],
      // 用户最喜欢的音乐
      favouriteList: [],
      // 登录用户(vuex 或者 本地)
      userInfo: "",
      // 选中的active
      active: 0,
    };
  },
  mounted() {
    // 获取用户详情
    this.getUserInfo();
    // 获取用户歌单
    this.getUserPlaylist();
  },
  methods: {
    ...mapMutations([]),
    // 获取用户详情 (vuex 或者 本地)
    getUserInfo() {
      if (this.profile.id) {
        console.log(this.profile);
        // Vuex 有数据
        this.userInfo = this.profile;
        console.log(1);
      } else if (localStorage.getItem("userInfo")) {
        // 本地有数据
        this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(this.userInfo);
      } else {
        console.log("未登录");
      }
    },
    // 获取用户歌单
    getUserPlaylist() {
      this.$http("/user/playlist", {
        params: {
          //  用户id
          uid: this.userInfo.userId,
          limit: 15,
        },
      }).then((res) => {
        console.log(res);
        this.playList = res.playlist;
        // 将数据的第一个歌单给favouriteList  然后剩下的给收藏歌单
        this.favouriteList = this.playList.shift();
        // shift-----删除数组第一个元素，并返回该元素，原数组被改变；
        // 过滤出用户创建歌单
        this.createList = this.playList.filter(item => {
          return item.userId == this.userInfo.userId;
        })
        // 过滤出用户收藏歌单
        this.collectList = this.playList.filter(item => {
          return item.userId !== this.userInfo.userId;
        })
        
        // 初始化滚动条
        this.initScroll();
      });
    },
    // 跳转到歌单详情 MusicList
    hrefMusicList(id) {
      this.$router.push(`/MusicList/${id}`);
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
    initScroll(){
      // 初始化滚动条
         setTimeout(()=>{
           this.$refs.wrapper._initScroll();
         },20)
    },
    // 改变了tabbar
    changeTabbar(){
      // 重新初始化滚动条
      this.initScroll();
    }
  },
  computed: {
    ...mapState(["profile"]),
  },
  components: {
    appHeader,
    headerTabbar,
    scroll,
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: #f1f1ef;
}
.wrapper {
  overflow: hidden;
  height: calc(100vh - 5.3rem);
  .content {
    padding: 1rem 1rem 0;
    padding-bottom: 4rem;
    // 用户详情
    .userInfo {
      // background-color: pink;
      display: flex;
      .avatar {
        width: 4rem;
        height: 4rem;
        padding-right: 1rem;
        img {
          width: 100%;
          border-radius: 50%;
          height: 100%;
        }
      }

      .info {
        flex: 5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            font-weight: 700;
            padding-bottom: 0.5rem;
          }

          .level {
            display: inline-block;
            background-color: #ec4036;
            color: #fff;
            font-size: 14px;
            border-radius: 8px;
            text-align: center;
          }
        }

        .right {
          i.iconfont {
          }
        }
      }
    }
    // 音乐应用
    .application {
      background-color: #fff;
      border-radius: 0.5rem;
      margin-top: 1rem;
      .list {
        display: flex;
        flex-wrap: wrap;
        .item {
          padding: 1rem 0;
          width: 25%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .iconfont {
            font-size: 26px;
            color: #ec4036;
          }

          span {
            padding-top: 0.2rem;
            font-size: 12px;
            color: #777;
          }
        }
      }
    }
    // 最喜欢的音乐
    .favourite {
      margin: 1rem 0;
      background-color: #fff;
      border-radius: 0.5rem;
      display: flex;
      padding: 1rem;
      .left {
        flex: 2;
        .img {
          img {
            border-radius: 0.5rem;
            width: 110%;
            height: 110%;
          }
        }
      }

      .middle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 9;
        padding-left: 0.8rem;

        .top {
          font-size: 14px;
        }

        .bottom {
          font-size: 12px;
          color: #777;
        }
      }

      .right {
        flex: 4;
        display: flex;
        align-items: center;
        justify-content: center;
        .model {
          padding: 0.1rem 0.3rem;
          background-color: #fff;
          border-radius: 1rem;
          border: 1px solid #ccc;
          font-size: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          .iconfont {
          }
        }
      }
    }

    // 创建歌单
    .userPlayList {
      margin-top: 1rem;
      background-color: #fff;
      border-radius: 0.5rem;
      .item {
        display: flex;
        padding: 0.5rem;
        .left {
          flex: 2;
          .img {
            img {
              border-radius: 0.5rem;
              width: 110%;
              height: 110%;
            }
          }
        }

        .middle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 9;
          padding-left: 0.8rem;

          .top {
            font-size: 14px;
          }

          .bottom {
            font-size: 12px;
            color: #777;
          }
        }

        .right {
          width: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          .iconfont {
          }
        }
      }
    }
  }
}

</style>
