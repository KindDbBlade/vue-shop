import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/Login.vue'
import Home from './../components/Home.vue'
import Welcome from './../components/Welcome.vue'

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
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

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
