<template>
	<div>
		<PrototypeView
			:app-name="appName"
			:app-editor="appName + '-editor'"
			:app-content="'app-content-' + appName"
			:session-info="sessionInfo"
			:user-list="userList"
			:filename="filename" />
	</div>
</template>

<script>
import PrototypeView from './PrototypeView'
import editor from './editor.js'
import collaborationEngine from './collaboration.js'
import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'

export default {
	name: 'ViewerView',

	components: {
		PrototypeView,
	},

	props: {
		filename: {
			type: String,
			required: true,
		},
		fileid: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			appName: 'whiteboard',
			appExt: 'wbr',
			appMime: 'application/whiteboard',
			userList: [],
			sessionInfo: {},
		}
	},

	created() {
		console.debug('CREATED 111')
	},

	mounted() {
		console.debug('MOUNTED 111')
		subscribe(this.appName + '::saveClick', this.SC = () => {
			this.saveEdit()
		})
		subscribe(this.appName + '::closeClick', this.CC = () => {
			console.debug('view close click')
			this.stopEdit()
		})
		this.startEdit()
		if (this.doneLoading) {
			console.debug('MOUNTED, done loading')
			this.doneLoading()
		}

		const sidebarButtons = document.getElementsByClassName('icon-menu-sidebar-white-forced')
		if (sidebarButtons.length > 0) {
			sidebarButtons[0].click()
		}
	},

	methods: {
		async startEdit() {
			// get the content and start the editor
			const content = await this.loadContent()
			this.ED = editor
			this.ED.start(this.appName, content)

			// start the collaboration Engine
			this.CE = collaborationEngine

			this.sessionInfo = await this.CE.start(this.appName, this.filename, this.fileid)
			// this.vm.sessionInfo = this.sessionInfo
			// subscribtion to event bus
			// local changes => send to Engine
			subscribe(this.appName + '::editorAddStep', this.EDS = (data) => {
				this.CE.sendStep(data)
			})

			// engine sent us changes => forward to editor
			subscribe(this.appName + '::externalAddStep', this.EAS = (data) => {
				this.ED.applyChange(data)
			})

			// engine tells us that users list changed
			subscribe(this.appName + '::usersListChanged', this.ECU = (users) => {
				this.userList.length = 0
				users.data.forEach(user => this.userList.push(user))
			})

			return true
		},

		// stop editing
		stopEdit() {
			// save the content
			this.saveEdit()

			// unsubscribe from bus event
			unsubscribe(this.appName + '::editorAddStep', this.EDS)
			unsubscribe(this.appName + '::externalAddStep', this.EAS)
			unsubscribe(this.appName + '::usersListChanged', this.ECU)
			unsubscribe(this.appName + '::closeClick', this.CC)
			unsubscribe(this.appName + '::saveClick', this.SC)

			// stop collaboration Engine
			this.CE.stop()

			// close editor
			this.ED.stop()
		},

		// load content
		loadContent() {
			const url = generateUrl('apps/' + this.appName + '/file/load')

			return axios.get(url, {
				params: {
					path: this.filename,
				},
			})
		},

		// save edit
		saveEdit() {
			if (!this.sessionInfo.ROSession) {
				const content = this.ED.getSave()
				const self = this
				const url = generateUrl('apps/' + this.appName + '/file/save')

				axios.post(url, {
					content: JSON.stringify(content),
					path: this.filename,
				}).then(() => {
					OC.Notification.showTemporary('File saved')
					const payload = {
						type: 'save',
						step: 'NA',
					}
					emit(self.appName + '::editorAddStep', payload)
				})
			}
		},
	},
}
</script>
