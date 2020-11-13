import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// less 语法
import less from 'less'
Vue.use(less)

// vant ui v
import 'vant/lib/index.css';
import {
  Field,
  CellGroup,
  Slider,
  Tab, 
  Tabs,
  Sticky
} from 'vant';
Vue.use(Field);
Vue.use(CellGroup);
Vue.use(Slider);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Sticky);

// axios
import axios from '@/http/http.js';

/* 引入axios进行地址访问*/
Vue.prototype.$http = axios;


// 图片懒加载

import VueLazyLoad from 'vue-lazyload';
Vue.use(VueLazyLoad, {
  preLoad: 1,
  error: require('./assets/error.jpg'),
  loading: require('./assets/download.png'),
  attempt: 2,
})

// icon css 
import '@/style/iconfont.css'
Vue.config.productionTip = false
 
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')