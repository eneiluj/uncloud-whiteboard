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

namespace OCA\whiteboard\Service ;

use OCA\whiteboard\Db\Step ;
use OCA\whiteboard\Db\StepMapper ;

use OCA\whiteboard\Db\User ;
use OCA\whiteboard\Db\UserMapper ;

class CollaborationEngine {

	private $StepMapper ;
	private $UserMapper ;
	private $AppName ;
	private $userId ;
	private $ressourceId ;

	public function __construct(StepMapper $StepMapper, UserMapper $UserMapper) {

		$this->StepMapper = $StepMapper ;
		$this->UserMapper = $UserMapper ;

	}

	public function setAppName(string $AppName) {
		$this->AppName = $AppName ;
	}

	public function setUserId(string $userId) {
		$this->userId = $userId ;
	}

	public function setRessourceId(string $ressourceId) {
		$this->ressourceId = $ressourceId ;
	}

	//DONE
	public function startSession() {
		// nothing to setup with DB engine
	}

	//DONE
	public function addUser() {
		$usr = $this->UserMapper->find($this->userId,$this->AppName,$this->ressourceId) ;

		if (! $usr) {
			$Nuser = new User() ;

			$Nuser->setAppId($this->AppName) ;
			$Nuser->setUserId($this->userId) ;
			$Nuser->setLastSeen(time()) ;
			$Nuser->setFileId($this->ressourceId) ;

			return $this->UserMapper->insert($Nuser);
		} else {
			$this->updateLastSeen($this->userId,$this->ressourceId) ;
			return "already there" ;
		} ;
	}

	//DONE
	public function removeUser() {
		$usr = $this->UserMapper->find($this->userId,$this->AppName,$this->ressourceId) ;
		$cnt = count($this->UserMapper->findAll($this->AppName,$this->ressourceId)) ;

		if ($usr) {
			$this->UserMapper->delete($usr) ;
		}

		$cnt = count($this->UserMapper->findAll($this->AppName,$this->ressourceId)) ;
		if ($cnt == 0) {
			$this->StepMapper->removeAll($this->ressourceId) ;
		}

		return "user removed" ;
	}

	// DONE
	public function addStep(string $type, string $datas) {
		$this->updateLastSeen($this->userId,$this->ressourceId) ;
		
		$Nstep = new Step() ;

		$Nstep->setAppId($this->AppName) ;
		$Nstep->setUserId($this->userId) ;
		$Nstep->setStepId(time()) ;
		$Nstep->setFileId($this->ressourceId) ;
		$Nstep->setStepForwarded($this->userId) ;
		$Nstep->setStepType($type) ;
		$Nstep->setStepData($datas) ;

		return $this->StepMapper->insert($Nstep);
	}
	
	// DONE
	public function getAllSteps() {
		$result =$this->StepMapper->findAll($this->AppName,$this->ressourceId) ;
		return $result ;
	}

	// DONE
	public function getUserList() {
		$users = $this->UserMapper->findAll($this->AppName,$this->ressourceId) ;

		foreach ($users as $user) {
			if ($user->getLastSeen() + 60 < time()) {
				$this->UserMapper->delete($user) ;
			}
		}
		return $users ;
	}

	// DONE
	public function waitForNewSteps() {
		$timeout = 20 ;
		$elapsedTime = 0;

		while (empty($steps) && $elapsedTime < $timeout) {
			$steps = $this->StepMapper->findLasts($this->AppName,$this->ressourceId,$this->userId) ;
			$elapsedTime++ ;
			if (empty($steps)) {
				sleep(1) ;
			}
		} ;

		$this->updateLastSeen() ;

		foreach ($steps as $step) {
			$forwarded = explode(',',$step->getStepForwarded()) ;
			$forwarded[] = $this->userId ;
			$result = implode(',',$forwarded) ;
			$step->setStepForwarded($result) ;
			$this->StepMapper->update($step) ;
		} ;
		
		return $steps ;
	}

	// PRIVATE
	private function updateLastSeen() {
		$usr = $this->UserMapper->find($this->userId,$this->AppName,$this->ressourceId) ;
		$usr->setLastSeen(time()) ;
		$this->UserMapper->update($usr) ;
	}
}
