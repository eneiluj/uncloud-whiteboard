<?php
/**
 * @author 2020 Matthieu Le Corre <matthieu.lecorre@univ-nantes.fr>
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

return [
	'routes' => [
		[ 'name' => 'file#save',     'url' => '/file/save', 'verb' => 'POST'  ],
		[ 'name' => 'file#load',     'url' => '/file/load', 'verb' => 'GET'   ],

		[ 'name'=> 'collaboration#startSession', 'url' => '/collaboration/startsession','verb' => 'POST'],

		[ 'name'=> 'collaboration#addStep', 'url' => '/collaboration/addstep','verb' => 'POST'],
		[ 'name'=> 'collaboration#getAllSteps', 'url' => '/collaboration/getallsteps','verb' => 'GET'],

		[ 'name'=> 'collaboration#addUser', 'url' => '/collaboration/adduser','verb' => 'POST'],
		[ 'name'=> 'collaboration#removeUser', 'url' => '/collaboration/removeuser','verb' => 'POST'],
		[ 'name'=> 'collaboration#getUserList', 'url' => '/collaboration/getuserlist','verb' => 'GET'],

		[ 'name'=> 'collaboration#getNewSteps', 'url'=> '/collaboration/getnewsteps', 'verb' => 'GET']
	]
];
