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

Vue.component('tree-table', TreeTable);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
