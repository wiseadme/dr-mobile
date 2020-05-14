import * as api from '@/api'
import * as action from '@/store/ActionTypes'
import * as mutation from '@/store/MutationTypes'

export default {
	async [action.SEND_INVITE](context, inviteParams) {
		try {
			const { data } = await api.sendInvite(inviteParams)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.FETCH_USERS](context, usersParams) {
		try {
			const { data } = await api.fetchUsers(usersParams)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.FETCH_OBJECTS](context, objectParams) {
		try {
			const { data } = await api.getObjects(objectParams)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.FETCH_NOTIFICATIONS](context, params) {
		try {
			const { data } = await api.getNotifications(params)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.FETCH_AGGREGATORS](context, eventParams) {
		try {
			const { data } = await api.getAggregators(eventParams)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.GET_EVENT_DATES]({ commit }) {
		try {
			const data = await api.getEventDates()
			commit(mutation.SET_EVENTS, data.data)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.FETCH_EQUIPMENTS](context, objectParams) {
		try {
			const { data } = await api.getEquipments(objectParams)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.CHANGE_PROFILE_PASSWORD](context, passwordObject) {
		try {
			const { data } = await api.changeProfilePassword(passwordObject)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.FETCH_USER_ROLES]() {
		try {
			const { data } = await api.fetchUserRoles()
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.FETCH_NOTIFY_TYPES]() {
		try {
			const { data } = await api.fetchNotificationTypes()
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.CONFIRM_USER](context, params) {
		try {
			await api.confirmUser(params)
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.GET_CHART_PARAMS](context, params) {
		try {
			const { data } = await api.getChartParameters(params)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	},

	async [action.DISABLE_USER](context, user) {
		try {
			const { data } = await api.disableUser(user)
			return data
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
