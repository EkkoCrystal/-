import Vue from 'vue'
import axios from 'axios'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css
import App from './App'
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

axios.get('/project.config.json').then((result) => {
  Vue.prototype.$baseConfig = result.data
  new Vue({
    el: '#app',
    render: h => h(App)

  })
}).catch((error) => {
  console.log('get baseConfig error...' + error)
})
