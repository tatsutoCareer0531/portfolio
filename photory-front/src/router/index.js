import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import PhotoList from '../views/PhotoList.vue'
import Error from '../views/Error.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/photoList',
    name: 'PhotoList',
    component: PhotoList
  },
  {
    path: '/error',
    name: 'Error',
    component: Error
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
