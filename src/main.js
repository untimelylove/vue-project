import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import ElementUI from 'element-ui'
import axios from 'axios'
// ? 注册全部的组件方法，到了后期上线再按需引入,css已经配置好了按需引入
Vue.use(ElementUI)

Vue.config.productionTip = false
// ? 配置公共跟地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// ? 把阿贾克斯配置给VUE
Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
