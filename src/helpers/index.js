/**
 *
 * @param restInstance - {AxiosInstance} - the instance of XMLHttpRequest
 * @param access_token - {object} - which is include the 'access_token' key
 */

export function setAccessToken(restInstance, { access_token }) {
  restInstance.defaults.headers.common['Authorization'] = access_token
}
