import Vue from 'vue';
import VueRouter from 'vue-router';
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'

// import Users from '../components/user/User.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'

// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'

// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'

// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue');
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue');
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue');

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/User.vue');
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/rights/Rights.vue');
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/rights/Roles.vue');

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue');
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue');

const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Goods.vue');
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue');

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/orders/Order.vue');
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue');

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
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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
