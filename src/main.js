import Vue from 'vue'
import Viewer from 'v-viewer'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from "axios"
import VueAxios from "vue-axios"
import mavonEditor from 'mavon-editor'

import "./main.css"
import 'viewerjs/dist/viewer.css'
import 'mavon-editor/dist/css/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
import "./assets/less/index.less"
import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'

import "./axios"
import "./permission"
import "./util/directive"

Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.use(Viewer)
Vue.use(ElementUI);
Vue.use(mavonEditor);
Vue.use(VueAxios, axios);
Vue.use(MarkdownItVueLight)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')