import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //username 为用法示例
  state: {
    username:"zxm"
  },
  getters:{
    grtusername: state => {
      return state.username;
    }
  },
  mutations: {
    //同步
    setusername(state){
      state.username = state.username
    },
    removeUsername(state,othername){
      state.username = othername
    }
  },
  actions: {
    //异步  触发改变
    setusernameFun(context){
      context.commit("setusername")
    },
    removeUsernameFun(context,othername){
      context.commit("removeUsername",othername);
    }

  },
  modules: {
  }
})
