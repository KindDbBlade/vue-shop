import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/Login.vue'
import Home from './../components/Home.vue'
import Welcome from './../components/Welcome.vue'
import Users from './../components/user/Users.vue'
import Rights from './../components/power/Rights.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:Rights
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
router.beforeEach( (to,from,next) => {
  //to 将要访问的 路径
  //from 从哪个路径跳转而来
  // next 函数  放行
  //   next（'/login'）  强制跳转
  if(to.path === '/login') return next();

  const tokenStr = window.sessionStorage.getItem("token");

  if(!tokenStr) return next('/login');
  next();
} )

export default router
