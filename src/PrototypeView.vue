<!--
 - @author Matthieu Le Corre <matthieu.lecorre@univ-nantes.fr>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program.  If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<Content :id="app" :app-name="appName">
		<button class="icon-close" @click="close" />
		<button class="icon-save" @click="save" />
		<button class="icon-menu-sidebar" @click="sidebar" />
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
		<AppContent :id="apped">
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
		appName: String,
		filename: String,
		context: Object,
		app: String,
		apped: String,
	},
	data: function() {
		return {
			userList: this.$parent.userList,
		}
	},
	methods: {
		isOffline: function(user) {
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
				OCA.Files.Sidebar.open(this.context.dir + '/' + this.filename)
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
  float:right ;
  top: 0;
  width: 30px;
  height: 30px;
  opacity: .5;
  z-index: inherit;
  border-width: 0px ;
}

button:hover {
	opacity: 1;
}

.AvatarList {
	position: relative;
	float: right;
	z-index: inherit;
	padding-right: 10px;
	margin-top: 2px ;
	display: flex ;
}

.AvatarList li {
	margin-left: 2px ;
}

.offline {
	opacity: .4 ;
}
</style>
