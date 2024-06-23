import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// vue-infinite-loading
import InfiniteLoading from 'vue-infinite-loading'
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// commonUtil
import commonUtils from './mixins/commonUtils'

// bootstrap
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
// vue-infinite-loading
Vue.use(InfiniteLoading)
// axios
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.mixin(commonUtils)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
