import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // ログイン情報
    loginFlg: false,
  },
  mutations: {
    // ログイン情報を保持
    setLoginInfo(state, loginInfoFlg) {
      state.loginFlg = loginInfoFlg;
    },
  },
  actions: {
    // ログイン情報を保持
    setLoginInfo(context, loginInfoFlg) {
      context.commit('setLoginInfo', loginInfoFlg);
    },
  },
  modules: {},
  plugins: [createPersistedState(
    {
      storage: window.sessionStorage
    }
  )]
})

export default store
