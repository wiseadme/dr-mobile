import Vue from 'vue'

export const events = new Vue()

export default {
  install(Vue) {
    const notify = params => {
      if (!params.type || !params.message) {
        throw (`Notification params not valid`)
      }
      if (!params.duration) {
        params.duration = 3000
      }
      params.id = Math.ceil(Math.random() * 99999 * 2e4)
      params.show = true
      events.$emit('add', params)
    }
    Vue.prototype.$notify = notify
  }
}