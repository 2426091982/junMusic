// axios
import axios from 'axios';

// ******* 配置 ******
// axios 路径
axios.defaults.baseURL = 'http://zhengjiajun.icu:4000';
// axios 响应拦截
axios.interceptors.response.use(function(res){
  return res.data;   //只有return res.data后才能完成响应
})

export default axios;