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

		this.SSE_URL = OC.generateUrl('apps/' + this.appName + '/collaboration/event')
		this.SSE_OPT = { withCredentials: true }

		this.init().then(function(data) {
			console.log('CE : Collaboration started for ' + self.appName)
			self.addUser()

			// because we may arrive in an allready running session
			// get all steps from last last save
			self.getSteps().then(function(steps) {
				steps.forEach(step => emit(self.appName + '::externalAddStep', step))
			})

			// start pulling for change
			self.communicationStarted = true
			console.log('CE : starting communication ')
			self.startCommunication()
		})

	},

	stop: function() {
		this.removeUser()
		this.stopCommunication()
		console.log('CE : Collaboration stopped for ' + this.appName)
	},

	init: function() {
		const url = OC.generateUrl('apps/' + this.appName + '/collaboration/startsession')
		this.id = window.FileList.findFile(this.filename).id

		const ajx = $.ajax({
			type: 'POST',
			url: url,
			data: { id: this.id },
		})
		return ajx.promise()
	},

	addUser: function() {
		const url = OC.generateUrl('apps/' + this.appName + '/collaboration/adduser')
		console.log('CE : Adding user ' + OC.currentUser)

		const ajx = $.ajax({
			type: 'POST',
			url: url,
			data: { id: this.id,
				user: OC.currentUser,
			},
		})
		return ajx.promise()
	},

	removeUser: function() {
		const url = OC.generateUrl('apps/' + this.appName + '/collaboration/removeuser')
		console.log('CE : Removing user ' + OC.currentUser)

		const ajx = $.ajax({
			type: 'POST',
			url: url,
			data: { id: this.id,
				user: OC.currentUser,
			},
		})
		return ajx.promise()
	},

	sendStep: function(payload) {

		const url = OC.generateUrl('apps/' + this.appName + '/collaboration/addstep')
		console.log('CE : Sending ', payload.type, ' step')
		const ajx = $.ajax({
			type: 'POST',
			url: url,
			data: { id: this.id,
				user: OC.currentUser,
				type: payload.type,
				step: JSON.stringify(payload.step),
			},
		})

		return ajx.promise()

	},

	getSteps: function() {
		const url = OC.generateUrl('apps/' + this.appName + '/collaboration/getsteps')
		console.log('CE : Getting initial steps')
		const ajx = $.ajax({
			type: 'GET',
			url: url,
			data: {
				id: this.id,
			},
		})

		return ajx.promise()
	},

	startCommunication: function() {
		const self = this

		this.longPull().done(function(steps) {
			steps.forEach(function(step) {
				if (step.userId != OC.currentUser) {
					emit(self.appName + '::externalAddStep', step)
					console.log('CE : A step for me !')
				}
			})
			if (self.communicationStarted == true) {
				self.startCommunication()
			}
		})
	},

	longPull: function() {
		const url = OC.generateUrl('apps/' + this.appName + '/collaboration/pushstep')
		console.log('CE : Poll again ...')
		const ajx = $.ajax({
			type: 'GET',
			url: url,
			data: {
				id: this.id,
				user: OC.currentUser,
			},
		})

		return ajx.promise()

	},

	stopCommunication: function() {
		this.communicationStarted = false
		// this.source.close() ;
	},

}
