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

namespace OCA\whiteboard\Controller ;

use OCP\AppFramework\Controller  ;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\IRequest;
use OCA\whiteboard\Service\CollaborationEngine ;


class CollaborationController extends Controller {
	/**
	 * @NoAdminRequired
	 *
	 **/
	public function __construct(string $AppName, IRequest $request, CollaborationEngine $engine, $userId) {
		parent::__construct($AppName, $request);

		$this->engine = $engine  ;

		$this->engine->setUserId($userId) ;
		$this->engine->setAppName($AppName) ;

		$this->engine->setRessourceId($request->getParam('id')) ;

	}

	/**
	 * @NoAdminRequired
	 *
	 **/
	public function startSession() {
		return new DataResponse($this->engine->startSession(),Http::STATUS_NO_CONTENT) ;
	}

	/**
	 * @NoAdminRequired
	 *
	 **/
	public function addUser() {
		return new DataResponse($this->engine->addUser()) ;
	}

	/**
	 * @NoAdminRequired
	 *
	 **/
	public function removeUser() {
		return new DataResponse($this->engine->removeUser()) ;
	}

	/**
	 * @NoAdminRequired
	 *
	 **/
	public function getUserList() {
		return new DataResponse($this->engine->getUserList()) ;
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $type
	 * @param string $step
	 *
	 **/
	public function addStep(string $type, string $step) {
		return new DataResponse($this->engine->addStep($type,$step)) ;
	}

	/**
	 * @NoAdminRequired
	 *
	 **/
	public function getAllSteps() {
		try {
			return new DataResponse($this->engine->getAllSteps()) ;
		} catch (DoesNotExistException $ex) {
			return new DataResponse($ex.message,Http::STATUS_NO_CONTENT) ;
		}
	}

	/**
	 * @NoAdminRequired
	 *
	 **/
	public function getNewSteps() {
		return new DataResponse($this->engine->waitForNewSteps()) ;
	}
}
