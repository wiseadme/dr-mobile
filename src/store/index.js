import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './modules/Auth'
import Data from './modules/Data'
import Style from './modules/Style'
import { storePlugin } from '../plugins/storePlugin'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		Auth,
		Data,
		Style
	},
	
	state: {},
	getters: {},
	mutations: {},
	actions: {},
	plugins: [storePlugin]
})
