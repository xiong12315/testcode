import Vue from "vue";
import VueRouter from "vue-router";
import login from "@/components/Login.vue";
import index from "@/components/Index.vue";
import welcome from "@/components/Welcome.vue";
import accountmanage from "@/components/user/AccountManage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/Login",
    component: login,
  },
  {
    path: "/Index",
    component: index,
    redirect: "/Index/Welcome",
    children: [
      {
        path: "/Index/Welcome",
        component: welcome,
      },
      {
        path: "/Index/AccountManage",
        component: accountmanage,
      },
    ],
  },
  {
    path: "/",
    redirect: "/Login",
  },
];

const router = new VueRouter({
  routes,
});
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 表示将要访问的路径
  //form 代表是从哪个路径跳转而来
  //next 是一个函数，表示放行
  //   next()   next('/login')在next后可以填入强制跳转的路径
  if (to.path === "/login") return next();
  //获取token
  const tokenStr = sessionStorage.getItem("token");
  //判断没有token就强制跳转
  if (!tokenStr) return next("/login");
  next();
});

export default router;
