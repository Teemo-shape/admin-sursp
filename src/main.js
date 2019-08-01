import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import "../src/assets/font/iconfont.css"
import './assets/js/flexible.js'
Vue.use(ElementUI, {
    size: 'small'
});

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import Mixin from './components/common/mixins';
Vue.mixin(Mixin);

import echarts from 'echarts'
Vue.prototype.$echarts = echarts 

import qs from 'qs'
import Axios from 'axios'
Vue.prototype.$http = Axios
Vue.prototype.$qs = qs

// 富文本编辑器
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 复制到粘贴板
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 图片放大
import VuePreview from 'vue-preview'
Vue.use(VuePreview) 

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
