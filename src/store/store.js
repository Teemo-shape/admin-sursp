import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        fullscreenLoading:false,
        isLogin:false
    },
    mutations: {
        //开启关闭遮罩层
        closeMask:state => state.fullscreenLoading = false ,
        openMask:state => state.fullscreenLoading = true ,
        //保存token
        saveLoginStatus(state, flag) {
            state.isLogin = flag;
        },
    },
    actions: {

    }
})
