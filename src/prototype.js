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

import editor from './editor.js'
import collaborationEngine from './collaboration.js'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { imagePath } from '@nextcloud/router'

import Vue from 'vue'
import PrototypeView from './PrototypeView'

/**
* @namespace ApplicationPrototype
*/
export default {
	name: 'ApplicationPrototype',

	// App init
	initialise: function(APP_NAME, APP_EXT, APP_MIME) {

		this.APP_NAME = APP_NAME
		this.APP_EXT = APP_EXT
		this.APP_MIME = APP_MIME

		this.NewFileMenu.APP_NAME = APP_NAME
		this.NewFileMenu.APP_EXT = APP_EXT
		this.NewFileMenu.APP_MIME = APP_MIME

		this.userList = []

		OC.Plugins.register('OCA.Files.NewFileMenu', this.NewFileMenu)
		this.registerFileActions()

	},

	// create container + handle close button
	setupContainer: function(filename, context) {

		const self = this

		const container = document.createElement('div')
		container.id = 'app-content-' + this.APP_NAME

		document.getElementById('app-content').appendChild(container)
		document.getElementById('app-navigation').classList.add('hidden')

		Vue.prototype.t = window.t
		Vue.prototype.n = window.n
		Vue.prototype.OCA = window.OCA

		this.vm = new Vue({
			data: {
				userList: this.userList,
			},
			render: h => h(
				PrototypeView,
				{
					props: {
						appName: this.APP_NAME,
						filename: filename,
						context: context,
						app: 'app-content-whiteboard',
						apped: 'whiteboard-editor',
					},
				}
			),
		})

		 this.vm.$mount(container)

		subscribe(this.APP_NAME + '::saveClick', function() {
			self.saveEdit()
		})
		subscribe(this.APP_NAME + '::closeClick', function() {
			self.stopEdit()
		})

	},

	// register file handler
	registerFileActions: function() {

		const self = this

		OCA.Files.fileActions.registerAction({
			name: 'Edit',
			mime: this.APP_MIME,
			permissions: OC.PERMISSION_READ,
			icon: function() {
				return imagePath('core', 'actions/edit')
			},
			actionHandler: function(filename, context) {
				self.setupContainer(filename, context)
				self.startEdit(filename, context)
			},
		})

		OCA.Files.fileActions.setDefault(this.APP_MIME, 'Edit')

	},

	// register "New" in file app
	NewFileMenu: {

		attach: function(menu) {

			// const self = this

			const fileList = menu.fileList
			if (fileList.id !== 'files') {
				return
			}

			menu.addMenuEntry({
				id: this.APP_NAME,
				displayName: t(this.APP_NAME, 'New ' + this.APP_NAME),
				templateName: t(this.APP_NAME, 'New ' + this.APP_NAME + '.' + this.APP_EXT),
				iconClass: 'icon-' + this.APP_NAME,
				fileType: this.APP_MIME,
				actionHandler: function(fileName) {
					// const dir = fileList.getCurrentDirectory()
					fileList.createFile(fileName)
						.then(function() {
							// console.log('New ' + self.APP_NAME)
						})
				},
			})
		},
	},

	// start editing
	startEdit: function(filename, context) {

		const self = this

		// start the editor
		this.ED = editor
		this.ED.start(this.APP_NAME, filename, context)

		// start the collaboration Engine
		this.CE = collaborationEngine
		this.CE.start(this.APP_NAME, filename, context)

		// subscribtion to event bus
		// local changes => send to Engine
		subscribe(this.APP_NAME + '::editorAddStep', this.EDS = (data) => {
			self.CE.sendStep(data).then(function() {
			})
		})

		// engine sent us changes => forward to editor
		subscribe(this.APP_NAME + '::externalAddStep', this.EAS = (data) => {
			self.ED.applyChange(data)
		})

		// engine tells us that users list changed
		subscribe(this.APP_NAME + '::usersListChanged', this.ECU = (users) => {
			this.userList.length = 0
			users.data.forEach(user => this.userList.push(user.userId))
			// console.log(this.userList)
		})

	},

	// stop editing
	stopEdit: function() {
		// save the content
		this.ED.saveContent()

		// unsubscribe from bus event
		unsubscribe(this.APP_NAME + '::editorAddStep', this.EDS)
		unsubscribe(this.APP_NAME + '::externalAddStep', this.EAS)

		// stop collaboration Engine
		this.CE.stop()

		// close editor
		this.ED.stop()

		// remove app container
		// TODO handle Vue destroying
		document.getElementById('app-content-' + this.APP_NAME).remove()
		document.getElementById('app-navigation').classList.remove('hidden')
	},

	// save edit
	saveEdit: function() {
		this.ED.saveContent()
	},

}
