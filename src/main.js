import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
//全局导入全局样式表
import './assets/css/global.css';
//全局导入字体图标
import './assets/fonts/iconfont.css';
import TreeTable from 'vue-table-with-tree-grid';
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
//导入富文本样式
import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme
//全局导入axios
import axios from 'axios';

Vue.config.productionTip = false;
//配置请求的根路径，用vuex方法也行
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios.defaults.baseURL = 'http://192.168.1.4:5000/api_backend/v1/';
// 请求拦截器
axios.interceptors.request.use(
  // console.log(config)
  config => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      // config.headers = { token: token }; //请求头加上token
      config.headers.Authorization = window.sessionStorage.getItem('token');
    }
    //最后必须return config
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
Vue.prototype.$http = axios; //每一个this组件都能通过$http访问到axios
//注册全局样式
Vue.use(VueQuillEditor /* { default global options } */);

Vue.component('tree-table', TreeTable);
//定义一个全局时间过滤器
//其中padStart()一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串
Vue.filter('dateformat', function(value) {
  let dt = new Date(value); //date方法返回
  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1 + '').padStart(2, '0');
  let d = (dt.getDate() + '').padStart(2, '0');
  let hh = (dt.getHours() + '').padStart(2, '0');
  let mm = (dt.getMinutes() + '').padStart(2, '0');
  let ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
