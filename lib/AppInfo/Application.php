<?php
/**
 * @author 2019 Matthieu Le Corre <matthieu.lecorre@univ-nantes.fr>
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

namespace OCA\whiteboard\Appinfo ;

use OCP\AppFramework\App;

class Application extends App {
	public function __construct(array $urlParams = []) {
		parent::__construct('whiteboard', $urlParams);

		$container = $this->getContainer() ;
		$server = $container->getServer() ;

		$eventDispatcher = $server->getEventDispatcher() ;
		$this->addPrivateListeners($eventDispatcher) ;
	}

	protected function addPrivateListeners($eventDispatcher) {
		$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts',
			function () {
				\OCP\Util::addscript('whiteboard', 'main');
				\OCP\Util::addStyle('whiteboard','style') ;
				\OCP\Util::addStyle('whiteboard','literallycanvas') ;
			});
	}
}
