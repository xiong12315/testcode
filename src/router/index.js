import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/Login.vue'
import home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:login,
  },
  {
    path:'/home',
    component:home,
  },
  {
    path:'/',
    redirect:'/Login'
  }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 表示将要访问的路径
  //form 代表是从哪个路径跳转而来
  //next 是一个函数，表示放行
  //   next()   next('/login')在next后可以填入强制跳转的路径
  if(to.path === '/login') return next()
  //获取token
  const tokenStr = sessionStorage.getItem('token')
  //判断没有token就强制跳转
  if(!tokenStr) return next('/login')
  next()
})

export default router
