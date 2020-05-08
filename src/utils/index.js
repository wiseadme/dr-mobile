import jwtDecode from 'jwt-decode'

/**
 *
 * @param token - {string} - the access token of current user
 * @returns {boolean} - if token is valid it return 'true', else return 'false'
 */

export function isJWTValid(token) {
	if (!token) {
		return false
	}
	const jwtData = jwtDecode(token) || {}
	const expires = jwtData.exp || 0
	return (new Date().getTime() / 1000) < expires
}

/**
 *
 * @param key - {string} - name of localStorage item
 * @param value - {any} - value to be saved and at the same time is a flag for action 'remove' or 'replace'
 * @param replace - {boolean} - flag for action 'remove' or 'replace'
 * @returns {string} - localStorage item
 */

export function lStorage(key, value = null, replace = false) {
	if (!value && !replace) {
		return JSON.parse(localStorage.getItem(key))
	} else if (!value && replace) {
		localStorage.removeItem(key)
	} else if (value && replace) {
		localStorage.removeItem(key)
		localStorage.setItem(key, JSON.stringify(value))
	} else {
		localStorage.setItem(key, JSON.stringify(value))
	}
}

export function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		'(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)'
	))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie(name, value, options = {}) {
	options = {
		path: '/',
		// при необходимости добавьте другие значения по умолчанию
		...options
	}
	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString()
	}

	let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

	for (let optionKey in options) {
		updatedCookie += '; ' + optionKey
		let optionValue = options[optionKey]
		if (optionValue !== true) {
			updatedCookie += '=' + optionValue
		}
	}
	document.cookie = updatedCookie
}

export function deleteCookie(name) {
	setCookie(name, '', {
		'max-age': -1
	})
}

