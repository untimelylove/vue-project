import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import ElementUI from 'element-ui'
import axios from 'axios'
import crumbs from './components/SubComponents/Crumbs.vue'
// ? 注册全部的组件方法，到了后期上线再按需引入,css已经配置好了按需引入
Vue.use(ElementUI)

Vue.config.productionTip = false
// ? 配置公共跟地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// ? 把阿贾克斯配置给VUE
Vue.prototype.$http = axios

axios.interceptors.request.use(function (config) {
  // config : axios的配置对象，计提时axios大对象内部的自己成员
  // console.dir(axios)
  // console.dir(config)
  // ? 此刻的config参数约等于axios里面的defaults对象
  // ? 把token绑定在到axios的身上（要通过请求头的方式携带token）
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
/* eslint-disable no-new */
// 注册公共面包屑组件为vue实例
Vue.component("com-crub",crumbs)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
