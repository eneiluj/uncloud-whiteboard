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
import { linkTo } from '@nextcloud/router'

export default {
	name: 'editor',

	start: function(APP_NAME, content) {

		const self = this
		this.appname = APP_NAME

		this.init().then(function() {
			self.loadContent(content)
			self.setupCallbacks()
		})

	},

	init: function() {
		return import(/* webpackChunkName: "literallycanvas" */ 'literallycanvas').then(LC => {
			this.LC = LC
			this.whiteboard = LC.init(
				document.getElementById(this.appname + '-editor'),
				{
					imageURLPrefix: linkTo(this.appname, 'img/lc_assets'),
					toolbarPosition: 'top',
				}
			)
		})
	},

	// load whiteboard
	loadContent: function(content) {
		if (content.data.trim() !== '') {
			this.whiteboard.loadSnapshot(JSON.parse(content.data))
		}
	},

	// save whiteboard
	getSave: function() {
		return this.whiteboard.getSnapshot()
	},

	// setup callback
	setupCallbacks: function() {
		const self = this

		// set save callback
		// this.whiteboard.on('drawingChange', function(data) {

		// emit(self.app_name+"::editorContentChange",data) ,

		// self.saveContent() ;
		// });

		this.whiteboard.on('shapeSave', function(data) {
			const payload = {
				'type': 'shapeSave',
				'step': self.LC.shapeToJSON(data.shape),
			}
			emit(self.appname + '::editorAddStep', payload)
			return data
		})

		/*
		this.whiteboard.on('backgroundColorChange', function(data) {
			const payload = {
				'type': 'backgroundColorChange',
				'step': data,
			}
			emit(self.appname + '::editorAddStep', payload)
			return data
		})
		*/

	},

	// destroy editor
	stop: function() {
		this.whiteboard.teardown()
	},

	applyChange: function(step) {
		switch (step.stepType) {
		case 'shapeSave':
			const shapeStep = this.LC.JSONToShape(JSON.parse(step.stepData)) // eslint-disable-line
			this.whiteboard.saveShape(shapeStep, false)
			break
		case 'backgroundColorChange':
			this.whiteboard.setColor('background', step.stepData)
			break
		case 'undo':
			this.whiteboard.undo()
			break
		case 'redo':
			this.whiteboard.undo()
			break
		default: console.warn('ED : Unknown step type')
		}
	},

}
