import * as mutation from '../../MutationTypes'

export default {
	[mutation.SET_TOKENS](state, { access_token, refresh_token }) {
		state.token = access_token
		state.refreshToken = refresh_token
	},

	[mutation.SET_USER_INFO](state, { permissions, info }) {
		state.user = { permissions, info }
	},

	[mutation.SET_DEVICE](state, device) {
		state.device = device
	},

	[mutation.REMOVE_USER_INFO](state) {
		state.user = {}
		state.token = ''
		state.refreshToken = ''
	}
}
