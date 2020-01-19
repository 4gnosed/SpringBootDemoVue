import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
var axios = require('axios')
Vue.prototype.$axios = axios

// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
axios.defaults.baseURL = 'http://localhost:8443/api'

// 前端每次发送请求时就会带上 sessionId
axios.defaults.withCredentials = true

Vue.config.productionTip = false

// 引入Element
Vue.use(ElementUI)

// .使用钩子函数判断页面是否拦截，在访问每一个路由前调用
// 判断访问的路径是否需要拦截，如果需要，判断 store 里有没有存储 user 的信息，
// 如果存在，则放行，否则跳转到登录页面，并存储访问的页面路径（以便在成功登录后跳转到要访问的页面）
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user) {
      // next()
      // 访问每个页面前都向后端发送一个请求,后端拦截器验证登录状态
      axios.get('/authentication').then(resp => {
        if (resp.data.code === 401) {
          login()
        } else {
          next()
        }
      })
    } else {
      login()
    }
  } else {
    next()
  }
  function login () {
    next({
      path: 'login',
      query: {redirect: to.fullPath}
    })
  }
}
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
