import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import backstageHome from '@/components/default' 
import user from '@/components/user'
import rights from '@/components/rights'
import role from '@/components/role.vue'
Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/login',
      component: login
    },
    // ? 当访问 / 就会重定向到 home 组件 home组件重定向到默显示的子组件
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: home,
      redirect:'/backstageHome',
      children:[
        {path: '/backstageHome',component: backstageHome},
        {path: '/users',component: user},
        {path: '/rights',component: rights},
        {path: '/roles',component: role},
      ]
    },
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
