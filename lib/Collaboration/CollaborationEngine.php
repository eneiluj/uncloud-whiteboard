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

namespace OCA\whiteboard\Collaboration ;

use OCP\ICache ;
use OCP\ICacheFactory;

use OCA\whiteboard\Db\Step ;
use OCA\whiteboard\Db\StepMapper ;

use OCA\whiteboard\Db\User ;
use OCA\whiteboard\Db\UserMapper ;

class CollaborationEngine {

    private $StepMapper ;
    private $UserMapper ;

    // private $cache ;

    public function __construct(ICacheFactory $cacheFactory, StepMapper $StepMapper, UserMapper $UserMapper) {

        $this->StepMapper = $StepMapper ;
        $this->UserMapper = $UserMapper ;

        $this->AppName = "whiteboard";

        //$this->cache = $cacheFactory->createDistributed('WhiteboardSession::'.$this->file);
 
    }

    //DONE
    public function startSession(int $fileId) {

        // nothing to setup with DB engine 
    } 

    //DONE
    public function addUser(int $fileId, string $user) {

        $usr = $this->UserMapper->find($user,$this->AppName,$fileId) ;

        if (! $usr) {
            $Nuser = new User() ;

            $Nuser->setAppId($this->AppName) ;
            $Nuser->setUserId($user) ;
            $Nuser->setLastSeen(time()) ;
            $Nuser->setFileId($fileId) ;

            return $this->UserMapper->insert($Nuser);

        } else {
            $this->updateLastSeen($user,$fileId) ;
            return "already there" ;
        } ;
    }

    //DONE
    public function removeUser(int $fileId, string $user) {
        $usr = $this->UserMapper->find($user,$this->AppName,$fileId) ;
        $cnt = count($this->UserMapper->findAll($this->AppName,$fileId)) ;

        if ($usr) {
            $this->UserMapper->delete($usr) ;
        }

        $cnt = count($this->UserMapper->findAll($this->AppName,$fileId)) ;
        if ( $cnt == 0 ) {
            $this->StepMapper->removeAll($fileId) ;
        }

        return "user removed" ;

    }

    // DONE
    public function addStep(int $fileId,string $user, string $type, string $datas) {

            $this->updateLastSeen($user,$fileId) ;
        
            $Nstep = new Step() ;

            $Nstep->setAppId($this->AppName) ;
            $Nstep->setUserId($user) ;
            $Nstep->setStepId(time()) ;
            $Nstep->setFileId($fileId) ;
            $Nstep->setStepForwarded($user) ;
            $Nstep->setStepType($type) ;
            $Nstep->setStepData($datas) ;

            return $this->StepMapper->insert($Nstep);

    }
    
    // DONE
    public function getSteps($fileId) {
        $result =$this->StepMapper->findAll($this->AppName,$fileId) ;
        return $result ;
    }

    // DONE 
    public function getUserList($fileId) {
        $users = $this->UserMapper->findAll($this->AppName,$fileId) ;

        foreach ($users as $user) {
            if ($user->getLastSeen() + 60 < time()) {
                $this->UserMapper->delete($user) ;
            }
        }
        return $users ;
    }

    // DONE
    public function waitForNewSteps(int $fileId, string $user){
        
        $timeout = 20 ;
        $elapsedTime = 0;

        while (empty($steps) && $elapsedTime < $timeout) {
            
            $steps = $this->StepMapper->findLasts($this->AppName,$fileId,$user) ;
            $elapsedTime++ ;
            if (empty($steps)) {
                sleep(1) ;
            }
        } ;

        $this->updateLastSeen($user,$fileId) ;

        foreach ($steps as $step) {
            $forwarded = explode(',',$step->getStepForwarded()) ;
            $forwarded[] = $user ;
            $result = implode(',',$forwarded) ;
            $step->setStepForwarded($result) ;
            $this->StepMapper->update($step) ;
        } ;
        return $steps ;
    }

    // PRIVATE 
    private function updateLastSeen(string $userId, int $fileId) {
        $usr = $this->UserMapper->find($userId,$this->AppName,$fileId) ;
        $usr->setLastSeen(time()) ;
        $this->UserMapper->update($usr) ;
    }
    
} 