/* eslint-env jquery */

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

		this.SSE_URL = generateUrl('apps/' + this.appName + '/collaboration/event')
		this.SSE_OPT = { withCredentials: true }

		this.init().then(function(data) {
			// console.log('CE : Collaboration started for ' + self.appName)
			self.addUser()

			// because we may arrive in an allready running session
			// get all steps from last last save
			self.getSteps().then(function(steps) {
				steps.data.forEach(step => emit(self.appName + '::externalAddStep', step))
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
		// console.log('CE : Collaboration stopped for ' + this.appName)
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

		const ajx = axios.post(url, {
			id: this.id,
			user: getCurrentUser().uid,
		})

		return ajx
	},

	removeUser: function() {
		const url = generateUrl('apps/' + this.appName + '/collaboration/removeuser')
		// console.log('CE : Removing user ' + OC.currentUser)

		const ajx = axios.post(url, {
			id: this.id,
			user: getCurrentUser().uid,
		})

		return ajx
	},

	sendStep: function(payload) {

		const url = generateUrl('apps/' + this.appName + '/collaboration/addstep')
		// console.log('CE : Sending ', payload.type, ' step')
		const ajx = axios.post(url, {
			id: this.id,
			user: getCurrentUser().uid,
			type: payload.type,
			step: JSON.stringify(payload.step),
		})

		return ajx

	},

	getSteps: function() {
		const url = generateUrl('apps/' + this.appName + '/collaboration/getsteps')
		// console.log('CE : Getting initial steps')
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
				self.startCommunication()
			}
		})
	},

	longPull: function() {
		const url = generateUrl('apps/' + this.appName + '/collaboration/pushstep')
		// console.log('CE : Poll again ...')
		const ajx = axios.get(url, {
			params: {
				id: this.id,
				user: getCurrentUser().uid,
			},
		})

		return ajx

	},

	stopCommunication: function() {
		this.communicationStarted = false
		// this.source.close() ;
	},

}
