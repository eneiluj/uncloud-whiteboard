/**
 * @author Matthieu Le Corre <matthieu.lecorre@univ-nantes.fr>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { emit } from '@nextcloud/event-bus'
import { generateUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'

/**
* @namespace collaborationEngine
*/
export default {

	name: 'collaborationEngine',

	start: function(appName, filename, context) {

		const self = this

		this.appName = appName
		this.filename = filename
		this.context = context

		this.init().then(function(sessionInfo) {

			self.sessionInfo = sessionInfo.data

			console.debug('sessionInfo', sessionInfo.data)

			self.addUser()
				.then(function(userType) {
					console.debug('User :', userType.data)
				})

			// because we may arrive in an allready running session
			// get all steps from last save
			self.getAllSteps()
				.then(function(steps) {
					steps.data.forEach(step => emit(self.appName + '::externalAddStep', step))
				}).catch(function(error) {
					console.debug(error.reponse)
				})

			// get users connected to the file
			self.getUserList().then(function(users) {
				emit(self.appName + '::usersListChanged', users)
			})

			// start pulling for change
			self.communicationStarted = true
			// console.log('CE : starting communication ')
			self.startCommunication()
		})

	},

	stop: function() {
		this.removeUser()
		this.stopCommunication()
	},

	init: function() {
		const url = generateUrl('apps/' + this.appName + '/collaboration/startsession')
		this.id = window.FileList.findFile(this.filename).id

		const ajx = axios.post(url, {
			id: this.id,
		})

		return ajx
	},

	addUser: function() {
		const url = generateUrl('apps/' + this.appName + '/collaboration/adduser')
		// console.log('CE : Adding user ' + OC.currentUser)

		return axios.post(url, {
			id: this.id,
		})

	},

	removeUser: function() {
		const url = generateUrl('apps/' + this.appName + '/collaboration/removeuser')
		// console.log('CE : Removing user ' + OC.currentUser)

		const ajx = axios.post(url, {
			id: this.id,
		})

		return ajx
	},

	sendStep: function(payload) {
		const self = this

		const url = generateUrl('apps/' + this.appName + '/collaboration/addstep')
		// console.log('CE : Sending ', payload.type, ' step')
		return axios.post(url, {
			id: this.id,
			type: payload.type,
			step: JSON.stringify(payload.step),
		}).catch((error) => {
			console.error('Network or server error, waiting 5 sec before retry -> ', error.message)
			setTimeout(() => { self.sendStep(payload) }, 5000)
			return Promise.reject(error)
		})

	},

	getAllSteps: function() {
		const url = generateUrl('apps/' + this.appName + '/collaboration/getallsteps')
		const ajx = axios.get(url, {
			params: {
				id: this.id,
			},
		})

		return ajx
	},

	getUserList: function() {
		const url = generateUrl('apps/' + this.appName + '/collaboration/getuserlist')
		const ajx = axios.get(url, {
			params: {
				id: this.id,
			},
		})
		return ajx
	},

	startCommunication: function() {
		const self = this

		this.longPull().then(function(reponse) {
			reponse.data.forEach(function(step) {
				if (step.userId !== getCurrentUser().uid) {
					emit(self.appName + '::externalAddStep', step)
					// console.log('CE : A step for me !')
				}
			})
			if (self.communicationStarted === true) {
				// reload long polling
				self.startCommunication()

				// and for check users
				self.getUserList().then(function(users) {
					emit(self.appName + '::usersListChanged', users)
				})

			}
		}).catch((error) => {
			if (axios.isCancel(error)) {
				console.debug(error.message)
				// return Promise.reject(error.message)
			} else {
				console.error('Network or server error, waiting 5 sec before retry -> ', error.message)
				setTimeout(() => { self.startCommunication() }, 5000)
			}
		})
	},

	longPull: function() {
		const CancelToken = axios.CancelToken
		this.longPullCancelToken = CancelToken.source()

		const url = generateUrl('apps/' + this.appName + '/collaboration/getnewsteps')

		return axios.get(url, {
			cancelToken: this.longPullCancelToken.token,
			params: {
				id: this.id,
			},
		})

	},

	stopCommunication: function() {
		this.communicationStarted = false
		this.longPullCancelToken.cancel('Closing Collaborative Engine ...')
	},

}
