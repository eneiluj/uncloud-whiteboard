/**
 * @author Julien Veyssier <eneiluj@posteo.net>
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

import ApplicationPrototype from './prototype.js'

const APP_NAME = 'whiteboard'
const APP_EXT = 'wbr'
const APP_MIME = 'application/whiteboard'

__webpack_nonce__ = btoa(OC.requestToken) 			 // eslint-disable-line
__webpack_public_path__ = OC.linkTo(APP_NAME, 'js/') // eslint-disable-line

OCA.whiteboard = ApplicationPrototype

document.addEventListener('DOMContentLoaded', () => {
	// add the + action to create a file
	OCA.whiteboard.initialize(APP_NAME, APP_EXT, APP_MIME)

	if (!OCA.Viewer) {
		OCA.whiteboard.registerFileActions()

		// check if we need to open the file directly
		const dir = document.getElementById('dir').value
		const filename = document.getElementById('filename').value
		const mimetype = document.getElementById('mimetype').value
		const sharingToken = document.getElementById('sharingToken') ? document.getElementById('sharingToken').value : null
		if (filename && dir === '' && mimetype === APP_MIME && sharingToken) {
			OCA.whiteboard.setupContainer(filename, 0, dir)
		}
	}
})
