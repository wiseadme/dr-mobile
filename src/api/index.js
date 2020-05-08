import axios from 'axios'

const auth = axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	maxContentLength: 50000000,
	timeout: 150000,
})

export const rest = axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	maxContentLength: 50000000,
	timeout: 150000,
})

//auth api
export const loginUser = userParams => auth.post('/api/v1/auth', userParams)
export const createUser = newUserParams => auth.post('/api/v1/reg', newUserParams)
export const refreshToken = params => auth.post('/api/v1/auth/refresh', params)
export const changePassword = params => auth.post('/api/v1/reg/forgotPassword', params)
export const checkInviteId = (email, id) => auth.get(`/api/v1/reg?email=${email}&link_id=${id}`)
export const checkCaptcha = () => auth.get('/api/v1/auth/captchaValid')

//rest api
export const fetchDevices = () => rest.get('/api/v1/auth/devices')

//profile requests
export const sendInvite = invite => rest.post('/api/v1/reg/invite', invite)
export const fetchUsers = params => rest.post('/api/v1/profile/users', params)
export const confirmUser = params => rest.post('/api/v1/profile/user', params)
export const changeProfilePassword = password => rest.post('/api/v1/reg/password', password)
export const disableUser = userLogin => rest.post('/api/v1/profile/user/disable', userLogin)

//notifications
export const provideUser = statusParams => rest.post('/api/v1/profile/user', statusParams)
export const getNotifications = notifyParams => rest.post('/api/v1/notifications', notifyParams)

//events
export const getEventDates = () => rest.get('/api/v1/events/dates')
export const getEvents = eventParams => rest.post('/api/v1/events/aggregators', eventParams)
export const getObjects = objectParams => rest.post('/api/v1/events/objects', objectParams)
export const getEquipments = equipmentsParams => rest.post('/api/v1/events/equipments', equipmentsParams)

//dictionaries
export const fetchUserRoles = () => rest.get('/api/v1/reference/roles')
export const fetchNotificationTypes = () => rest.get('/api/v1/reference/notificationTypes')
