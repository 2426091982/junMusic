<template>
  <div>
    <!-- 评论头部 -->
    <div class="header">
      <div class="left">
        <i @click="$router.go(-1)" class="iconfont iconzuoxia-copy"></i>
      </div>
      <div class="middle">
        <div class="commonent">评论({{ musicComments.total }})</div>
      </div>
      <div class="right">
        <i class="iconfont iconfenxiang1"></i>
      </div>
    </div>
    <!-- 歌曲详情 -->
    <div v-if="this.songs[0]" class="songInfo">
      <div class="left">
        <img v-lazy="this.songs[0].al.picUrl" alt="" />
      </div>
      <div class="middle">
        <div class="top">{{ this.songs[0].name }}</div>
        <div class="bottom">
          <!-- 歌手的曲子和搜索的曲子兼容 -->
          <span v-for="item in this.songs[0].artists" :key="item.id">
            {{ item.name }}
          </span>
          <span v-for="item in this.songs[0].ar" :key="item.id">
            {{ item.name }}
          </span>
        </div>
      </div>
      <!-- 右边 -->
      <div class="right">
        <i class="iconfont iconarrow-left"></i>
      </div>
    </div>
    <!-- 小黑边 -->
    <div class="block"></div>
    <!-- 评论 -->
    <div class="comments">
      <!-- 评论头部 -->
      <div class="commentsHeader">
        <div class="left">
          评论区
        </div>
        <div class="right">
          <ul class="type">
            <li
              @click="changeCommentsType('Hot')"
              :class="this.commentsType == 'Hot' ? 'active' : ''"
            >
              最热
            </li>
            <li
              @click="changeCommentsType('New')"
              :class="this.commentsType == 'New' ? 'active' : ''"
            >
              最新
            </li>
          </ul>
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
          <template v-if="this.commentsType === 'Hot'">
            <li
              v-for="item in musicComments.hotComments"
              :key="item.commentId"
              class="item"
            >
              <!-- 上层 -->
              <div class="top">
                <div class="userImg">
                  <img v-lazy="item.user.avatarUrl" alt="" />
                </div>
                <div class="userInfo">
                  <div class="userName">{{ item.user.nickname }}</div>
                  <div class="userTime">{{ item.time | dateFormate }}</div>
                </div>
                <div class="like">
                  <div class="likeCount">
                    {{ item.likedCount }}
                    <i class="iconfont iconzanpress"></i>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <div class="left"></div>
                <div class="right">
                  <div class="text">
                    <p>
                      {{ item.content }}
                    </p>
                  </div>
                  <div class="reply">299条回复</div>
                </div>
              </div>
            </li>
          </template>
          <template v-elseif="this.commentsType === 'New'">
            <li
              v-for="item in musicComments.comments"
              :key="item.commentId"
              class="item"
            >
              <!-- 上层 -->
              <div class="top">
                <div class="userImg">
                  <img v-lazy="item.user.avatarUrl" alt="" />
                </div>
                <div class="userInfo">
                  <div class="userName">{{ item.user.nickname }}</div>
                  <div class="userTime">{{ item.time | dateFormate }}</div>
                </div>
                <div class="like">
                  <div class="likeCount">
                    {{ item.likedCount }}
                    <i class="iconfont iconzanpress"></i>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <div class="left"></div>
                <div class="right">
                  <div class="text">
                    <p>
                      {{ item.content }}
                    </p>
                  </div>
                  <div class="reply">299条回复</div>
                </div>
              </div>
            </li>
          </template>
        </ul>
        <div class="loading-wrapper"></div>
      </scroll>
    </div>
  </div>
</template>

<script>
// better scroll 滑动组件
import scroll from "@/components/common/scroll.vue";

export default {
  data() {
    return {
      // 评论数据
      musicComments: [],
      // 歌曲封面
      songs: [],
      // 评论类型
      commentsType: "Hot",
      // 下拉是否开启
      pulldown: true,
      // 上拉是否开启
      pullup: true,
    };
  },
  activated() {
    // 获取评论数据
    this.getComment();
    // 获取歌曲详情
    this.getAlbum();
  },
  methods: {
    // 获取评论
    getComment() {
      this.$http("/comment/music", {
        params: {
          id: this.$route.params.id,
        },
      }).then((res) => {
        console.log(res);
        this.musicComments = res;

        // 初始化
        this.initScroll();
      });
    },
    // 改变评论类型
    changeCommentsType(type) {
      this.commentsType = type;
      this.initScroll();
    },
    // 获取专辑详情(目的获取专辑封面)
    getAlbum() {
      this.$http("/song/detail", {
        params: {
          ids: this.$route.params.id,
        },
      }).then((res) => {
        console.log(res);
        this.songs = res.songs;
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
  filters: {
    dateFormate(date) {
      // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
      var date = new Date(date);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .left {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    i.iconfont.iconzuoxia-copy {
    }
  }

  .middle {
    flex: 8;
    .commonent {
      font-weight: 700;
    }
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    i.iconfont.iconfenxiang1 {
    }
  }
}

// 歌曲详情
.songInfo {
  display: flex;
  padding: 1rem;
  .left {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 4rem;
      height: 4rem;
      border-radius: 0.3rem;
    }
  }

  .middle {
    flex: 7;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 0.5rem;
    .top {
    }

    .bottom {
      font-size: 14px;
      color: #7392ac;
      span {
      }
    }
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    i.iconfont.iconarrow-left {
    }
  }
}
.block {
  height: 0.5rem;
  background-color: #f8f8f8;
}

.comments {
    padding: 0.5rem;

  .commentsHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-weight: 700;
    }

    .right {
      .type {
        display: flex;
        li {
          padding: 1rem;
          font-weight: 700;
          color: #aaa;
          font-size: 14px;
        }
        .active {
          font-weight: 700;
          color: #666;
        }
      }
    }
  }
  .wrapper {
    height: calc(100vh - 14.1rem);
    overflow: hidden;
    .content {
      padding-bottom: 4rem;
      .item {
        .top {
          display: flex;
          justify-content: center;
          .userImg {
            flex: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }
        }

        .userInfo {
          flex: 9;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 0.5rem;
          .userName {
          }

          .userTime {
            font-size: 12px;
            color: #aaa;
          }
        }

        .like {
          flex: 2;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #aaa;
          .likeCount {
            i.iconfont.iconzanpress {
            }
          }
        }
      }

      .bottom {
        width: 100vw;
        display: flex;
        .left {
          flex: 2;
        }
        .right {
          padding: 0 0.5rem;
          flex: 11;
          .text {
            p {
              margin: 0;
              padding: 0;
              font-size: 14px;
            }
          }

          .reply {
            font-size: 12px;
            color: #80909c;
          }
        }
      }
    }
  }
}
</style>
