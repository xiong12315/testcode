import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//全局导入全局样式表
import './assets/css/global.css'
//全局导入字体图标
import './assets/fonts/iconfont.css'
//全局导入axios
import axios from 'axios'

Vue.config.productionTip = false
//配置请求的根路径，用vuex方法也行
axios.defaults.baseURL = 'http://192.168.1.4:5000/api_backend/v1/'
Vue.prototype.$http = axios //每一个this组件都能通过$http访问到axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
