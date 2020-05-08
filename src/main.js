import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import Notify from './services/Notifications/index.js'
import moment from 'moment'
import { loadBaseComponents } from './services/BaseComponents'

//set base components
loadBaseComponents()

Vue.use(Notify)
Vue.prototype.$moment = moment

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
