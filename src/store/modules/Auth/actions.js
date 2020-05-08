import * as api from '@/api'
import * as action from '@/store/ActionTypes'
import * as mutation from '@/store/MutationTypes'
import { rest } from '@/api'
import { setAccessToken } from '@/helpers'
import { lStorage } from '@/utils'

export const actions = {
	async [action.CREATE_USER]({ commit }, newUserParams) {
		try {
			const { data } = await api.createUser(newUserParams)
			commit(mutation.SET_TOKENS, data)
			commit(mutation.SET_USER_INFO, data)
			setAccessToken(rest, data)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.LOGIN_USER]({ commit }, userParams) {
		try {
			const { data } = await api.loginUser(userParams)
			commit(mutation.SET_TOKENS, data)
			commit(mutation.SET_USER_INFO, data)
			setAccessToken(rest, data)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	[action.LOGOUT_USER]({ commit }) {
		lStorage('user', null, true)
		lStorage('tokens', null, true)
		commit(mutation.REMOVE_USER_INFO)
	},

	async [action.REFRESH_TOKEN]({ commit }, refresh) {
		try {
			const { data } = await api.refreshToken(refresh)
			commit(mutation.SET_TOKENS, data)
			setAccessToken(rest, data)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	[action.SET_REST_TOKENS]({ commit }, tokens) {
		commit(mutation.SET_TOKENS, tokens)
		setAccessToken(rest, tokens)
	},

	async [action.CHECK_CAPTCHA]() {
		try {
			const { data } = await api.checkCaptcha()
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.CHECK_UNIQ_ID](context, { email, id }) {
		try {
			const { data } = await api.checkInviteId(email, id)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.CHANGE_PASSWORD](context, params) {
		try {
			const { data } = await api.changePassword(params)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export default actions
