<template>
  <div>
    <!-- 搜索 -->
    <div class="search">
      <div class="left" >
        <i class="iconfont iconkuohao" @click="$router.go(-1)"></i>
      </div>
      <div class="middle">
        <input
          @input="searchInput"
          type="text"
          v-model="keywords"
          placeholder="搜索歌曲、歌手"
        />
      </div>
      <div @click="clearKeywords" class="right">
        <i class="iconfont iconchahao"></i>
      </div>
    </div>
    <!-- 热门搜索关键词 -->
    <div v-if="!this.songs" class="hotSearch">
      <div class="title">热门搜索</div>
      <ul class="keyWords">
        <li
          @click="searchKeyWords(item.first)"
          v-for="item in hotKeywords"
          :key="item.id"
        >
          <a href="#">{{ item.first }}</a>
        </li>
      </ul>
    </div>
    <!-- 历史搜索关键词 -->
    <div v-if="!this.songs" class="hotSearch">
      <div class="title">搜索历史</div>
      <ul class="keyWords">
        <li
          @click="searchKeyWords(item)"
          v-for="item in keywordList"
          :key="item"
        >
          <a href="#">{{ item }}</a>
        </li>
      </ul>
    </div>
    <!-- 搜索列表 -->
    <div v-if="this.songs">
      <scroll
      ref="wrapper"
        class="wrapper"
        :pulldown="pulldown"
        @pulldown="loadData"
        :pullup="pullup"
        @scrollToEnd="scrollToEnd"
      >
        <ul class="content">
          <!-- 项目 -->
          <li
            @click="hrefPlayMusic(i1)"
            class="item"
            v-for="(item1, i1) in this.songs"
            :key="item1.id"
          >
            <div class="top van-ellipsis">
              {{ item1.name }}
            </div>
            <div class="bottom">
              <span v-for="item2 in item1.artists" :key="item2.name">
                {{ item2.name }}
              </span>
            </div>
          </li>
        </ul>
        <div class="loading-wrapper"></div>
      </scroll>
    </div>
  </div>
</template>

<script>
// better scroll 滑动组件
import scroll from "@/components/common/scroll.vue";
// Vuex
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      // 关键词
      keywords: "",
      // 定时器
      searchTimer: "",
      // 歌曲
      songs: "",
      // 下拉是否开启
      pulldown: true,
      // 上拉是否开启
      pullup: true,
      // 歌曲url
      songUrl: "",
      // 热门关键词
      hotKeywords: [],
      // 搜索历史列表
      keywordList: [],
    };
  },
  activated() {
    // 获取热搜列表(详细)
    this.getHotKeywords();
    // 获取本地搜素历史
    this.getKeywords();
  },
  methods: {
    ...mapMutations(["updatePlayObj"]),
    // 输入框输入时候
    searchInput() {
      // 如果用户继续输入就清除上一个定时器
      clearTimeout(this.searchTimer);
      if (this.keywords.trim().length !== 0) {
        this.searchTimer = setTimeout(() => {
          this.searchKeyWords();
        }, 500);
      }
    },
    // 搜索关键词
    searchKeyWords(hotKeywords) {
      if (hotKeywords) {
        // 如果有传入热搜关键词就赋值给 关键词
        this.keywords = hotKeywords;
      }
      this.$http("/search", {
        params: {
          keywords: this.keywords,
        },
      }).then((res) => {
        console.log(res);
        this.songs = res.result.songs;
        console.log(this.songs);

        // 初始化滚动条
         this.initScroll();
      });
    },
    // 跳转到播放歌曲
    hrefPlayMusic(i) {
      let newPlayObj = {
        songList: this.songs,
        activeIndex: i,
        miniIsPlay: false
      };
      // 更新 newPlayObj
      this.updatePlayObj(newPlayObj);
      // 存储历史播放记录
      this.storageKeywords();
      // 跳转
      this.$router.push("/playMusic");
    },
    // 清除关键词
    clearKeywords() {
      this.keywords = "";
      this.songs = "";
    },
    // 下拉重新获取数据
    loadData() {
      console.log("下拉");
    },
    // 上拉加载
    scrollToEnd() {
      console.log("上拉");
    },
    // 获取热搜列表
    getHotKeywords() {
      this.$http("/search/hot").then((res) => {
        this.hotKeywords = res.result.hots;
      });
    },
    // 获取搜索历史关键词
    getKeywords() {
      this.keywordList = JSON.parse(localStorage.getItem("keywordList"));
      console.log(this.keywordList);
    },
    // 存储搜索历史关键词
    storageKeywords() {
      if (this.keywordList === null) {
        console.log(1);
        // 如果为 null ,创建一个新数组
        this.keywordList = [];
      }
      // 存储到本地

      this.keywordList.push(this.keywords);
      //数组去重,防止播放历史重复
      this.keywordList = this.unique(this.keywordList);
      console.log(this.keywordList);

      localStorage.setItem("keywordList", JSON.stringify(this.keywordList));
    },
    // 数组去重
    unique(arr) {
      console.log(arr);
      return arr.filter(function(item, index, arr) {
        return arr.indexOf(item, 0) === index;
      });
    },
    // 初始化滚动条
    initScroll() {
      // 初始化滚动条
      setTimeout(() => {
        this.$refs.wrapper._initScroll();
      }, 20);
    },
  },
  components: {
    scroll,
  },
};
</script>

<style lang="less" scoped>
.search {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d44439;
  height: 3rem;
  color: #fff;
  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 2;
    font-weight: 700;
    i.iconfont {
    }
  }
  .middle {
    flex: 10;
    input {
      width: 100%;
      background: none;
      border: none;
      border-bottom: 1px solid #fff;
      font-size: 14px;
      padding-bottom: 0.2rem;
    }
    input::-webkit-input-placeholder {
      color: #eeb4b0;
    }
    input::-moz-input-placeholder {
      color: #eeb4b0;
    }
    input::-ms-input-placeholder {
      color: #eeb4b0;
    }
  }
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 2;
  }
}

.hotSearch {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    font-size: 12px;
    color: #757575;
    padding-bottom: 0.5rem;
  }

  .keyWords {
    display: flex;
    flex-wrap: wrap;
    li {
      margin: 0.3rem;
      a {
        display: inline-block;
        padding: 0.3rem;
        border-radius: 0.5rem;
        border: 0.8px solid #c7c7c7;
        color: #333;
        font-size: 14px;
      }
    }
  }
}

.wrapper {
  overflow: hidden;
  height: calc(100vh - 3rem);
  ul.content {
    .item {
      display: flex;
      height: 3.5rem;
      background-color: #f2f3f4;
      border-bottom: 1px solid #e7e7e7;
      flex-direction: column;
      justify-content: center;
      padding-left: 1rem;
      .top {
        font-size: 16px;
      }

      .bottom {
        span {
          font-size: 12px;
          color: #8b8b8b;
        }
      }
    }
  }

  .loading-wrapper {
  }
}
</style>
