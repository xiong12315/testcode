import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/components/Login.vue';
import Home from '@/components/Index.vue';
import Welcome from '@/components/Welcome.vue';
import Users from '@/components/user/User.vue';
import Roles from '@/components/rights/Roles.vue';
import Rights from '@/components/rights/Rights.vue';
import Cate from '@/components/goods/Cate.vue';
import Params from '@/components/goods/Params.vue';
import Goods from '@/components/goods/Goods.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [
      { path: '/home', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods }
    ]
  }
];

const router = new VueRouter({
  routes
});
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 表示将要访问的路径
  //form 代表是从哪个路径跳转而来
  //next 是一个函数，表示放行
  //   next()   next('/login')在next后可以填入强制跳转的路径
  if (to.path === '/login') return next();
  //获取token
  const tokenStr = sessionStorage.getItem('token');
  //判断没有token就强制跳转
  if (!tokenStr) return next('/login');
  next();
});

export default router;
