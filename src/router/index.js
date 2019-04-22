import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home
    }
  ]
})
// ? 设置路由守卫 做登录用户访问限制
router.beforeEach((to, from, next) => {
      var token = window.sessionStorage.getItem('token')
      if (token === null && to.path !== '/login') {
        return next('/login')
      }
      next()
    })
export default router
