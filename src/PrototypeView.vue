<template>
	<Content :id="appContent" :app-name="appName">
		<button class="icon-close" @click="close" />
		<button v-if="!ROSession" class="icon-save" @click="save" />
		<button v-if="!ROSession" class="icon-menu-sidebar" @click="sidebar" />
		<ul v-if="userList.length > 1" class="AvatarList">
			<li v-for="user in userList"
				:key="userList.indexOf(user)"
				:class="{ offline: isOffline(user) }">
				<Avatar
					:display-name="user.userId"
					:user="user.userId"
					menu-position="right" />
			</li>
		</ul>
		<div v-if="ROSession == true" class="ro">
			You don't have write access to this ressource, your modifications won't be forwarded and won't be saved
		</div>
		<AppContent :id="appEditor">
			Loading {{ appName }} ...
		</AppContent>
	</Content>
</template>

<script>
import Content from '@nextcloud/vue/dist/Components/Content'
import AppContent from '@nextcloud/vue/dist/Components/AppContent'
import Avatar from '@nextcloud/vue/dist/Components/Avatar'
import { emit } from '@nextcloud/event-bus'

export default {
	name: 'PrototypeView',

	components: {
		Content,
		AppContent,
		Avatar,
	},

	props: {
		appName: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
		appContent: {
			type: String,
			required: true,
		},
		appEditor: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			userList: this.$parent.userList,
			// sessionInfoRO: this.$parent.sessionInfo.ROSession,
		}
	},

	computed: {
		ROSession() {
			return this.$parent.sessionInfo.ROSession
		},
	},

	destroyed() {
		/*
		document.getElementById('app-content-' + this.appName).remove()
		document.body.style.overflowY = ''
		document.getElementById('app-navigation').classList.remove('hidden')
		*/
		this.close()
	},

	methods: {
		isOffline(user) {
			const now = Math.floor(Date.now() / 1000) - 30
			if (user.lastSeen < now) {
				return true
			} else {
				return false
			}
		},
		save() {
			emit(this.appName + '::saveClick')
		},
		close() {
			emit(this.appName + '::closeClick')
		},
		sidebar() {
			if (!document.getElementById('app-sidebar')) {
				OCA.Files.Sidebar.open(this.filename)
			} else {
				OCA.Files.Sidebar.close()
			}
		},
	},
}
</script>

<style scoped>
button {
	position: relative;
	float: right;
	top: 0;
	width: 30px;
	height: 30px;
	opacity: 0.5;
	border-width: 0;
	z-index: 99999;
}

button:hover {
	opacity: 1;
}

.AvatarList {
	position: relative;
	float: right;
	z-index: inherit;
	padding-right: 10px;
	margin-top: 2px;
	display: flex;
}

.AvatarList li {
	margin-left: 2px;
}

.offline {
	opacity: 0.4;
}

.ro {
	position: relative;
	float: right;
	z-index: inherit;
	padding-right: 10px;
	margin-top: 5px;
	display: flex;
	color: red;
}
</style>
