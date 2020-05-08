import router from '../routes'
import { isJWTValid, lStorage } from '../utils'
import { rest } from '../api'
import { events } from '../services/Notifications'

const state = {
  isRefreshed: false,
  refreshToken: ''
}

/***
 *
 * @param store - {object} - access to the main store of application
 * @description - intercept each request and check the validity of the access token
 */

export const storePlugin = (store) => {
  rest.interceptors.request.use(async (request) => {
    if (isJWTValid(store.state.Auth.token)) return request
    state.refreshToken = store.state.Auth.refreshToken
    await store.dispatch('Auth/REFRESH_TOKEN', { refresh_token: state.refreshToken })
      .then(data => {
        state.isRefreshed = !state.isRefreshed
        request.headers.Authorization = store.state.Auth.token
        lStorage('tokens', data, true)
        setTimeout(() => state.isRefreshed = !state.isRefreshed)
      })
    if (state.isRefreshed) return request
  })

  /**
   * @description - intercept every response and handle error by error status
   */

  rest.interceptors.response.use(response => response, err => {
      const { response: { data } } = err
      if (data.status === 401) {
        store.dispatch('Auth/LOGOUT_USER')
        router.replace('/auth/login')
      }
      events.$emit('add', {
        type: 'danger',
        message: data && data.message ? data.message : 'Ошибка сервера',
        show: true,
        duration: 5000,
        id: Math.ceil(Math.random() * 99999 * 2e4)
      })
    }
  )
}
