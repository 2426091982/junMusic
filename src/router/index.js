import Vue from 'vue'
import VueRouter from 'vue-router'
/* 选择登录页面 */
const Auth = () => import('@/views/Auth.vue')
// 登录注册
const Register = () => import('@/views/Register.vue')
// 手机登录
const Login = () => import('@/views/Login.vue')
// 手机验证
const CheckCode = () => import("@/views/CheckCode.vue")
// 歌曲推荐
const Recommend = () => import("@/views/Recommend.vue")
// 歌曲排行
const Rank = () => import("@/views/Rank.vue")
// 歌手
const Singer = () => import("@/views/Singer.vue")
// 歌曲，榜单详情模板
const MusicList = () => import("@/views/MusicList.vue")
// 电台详情模板
const RadioList = () => import("@/views/RadioList.vue")
// 歌手热门50首详情模板
const singerSongList = () => import("@/views/singerSongList.vue")
// 播放歌曲组件
const playMusic = () => import("@/views/playMusic.vue")
// 搜索歌曲
const search = () => import("@/views/search.vue")
//  用户详情
const user = () => import("@/views/user.vue")
//  评论组件
const comments = () => import("@/views/Comments.vue")



Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [{
    // 路由重定向
    path: '/',
    redirect: '/Auth'
  }, {
    path: '/Auth',
    component: Auth,
    meta: {
      index: 1
    }
    
  },
  {
    path: '/Register',
    component: Register,
    meta: {
      index: 0
    }
  },
  {
    path: '/Search',
    component: search,
    meta: {
      index: 1
    }
  },
  {
    path: '/Login',
    component: Login,
    meta: {
      index: 0
    }
  },
  {
    path: '/CheckCode',
    component: CheckCode,
    meta: {
      index: 0
    }
  },
  {
    path: '/recommend',
    component: Recommend,
    meta: {
      index: 0
    }
  },
  {
    path: '/MusicList/:id',
    component: MusicList,
    meta: {
      index: 2
    }
  },
  {
    path: '/RadioList/:id',
    component: RadioList,
    meta: {
      index: 2
    }
  },
  {
    path: '/singerSongList/:id',
    component: singerSongList,
    meta: {
      index: 2
    }
  },
  {
    path: '/Rank',
    component: Rank,
    meta: {
      index: 0
    }
  },
  {
    path: '/Singer',
    component: Singer,
    meta: {
      index: 0
    }
  },
  {
    path: '/playMusic',
    component: playMusic,
    meta: {
      index: 999
    }
  },
  {
    path: '/user',
    component: user,
    meta: {
      index: 0
    }
  },
  {
    path: '/comments/:id',
    component: comments,
    meta: {
      index: 1
    }
  }
]

const router = new VueRouter({
  // h5 路由模式
  // mode: "history",
  routes,
})

export default router