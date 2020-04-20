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

//class SimpleFileCollaborationEngine implements ICollaborationEngine {
class SimpleFileCollaborationEngine {

    public function __construct(string $fileId, ICacheFactory $cacheFactory) {

        $this->file = $fileId ;
        $this->cache = $cacheFactory->createDistributed('WhiteboardSession::'.$this->file);
        
        try  {
            $this->Fsession = json_decode(file_get_contents("/tmp/session-".$this->file),true) ;
        } catch (Exception $e) {
            $this->Fsession =Array() ;
        }
    }

    public function startSession(string $file) {
        if (! (in_array($file,$this->Fsession["session"]))) {
            $this->Fsession["session"] = $file ;
            return $this-> updateStorage() ;
        } ;
    } 

    public function addUser(string $user) {
        if (! (in_array($user,$this->Fsession["user"]))) {
            $this->Fsession["user"][]=$user ;
            return $this-> updateStorage() ;
        } ;
    }

    public function removeUSer(string $user) {
        $index = array_search($user, $this->Fsession["user"]) ;
        if ($index !== FALSE ) {
            unset($this->Fsession["user"][$index]) ;
            if ( $this->getUserNumber() == 0 ) {
                return $this->sessionDestroy() ;
            } else {
                return $this-> updateStorage() ;
            } ;
        } ;
    }

    public function addStep($user,$type,$datas) {
        $step = array (
            "user" => $user,
            "type" => $type,
            "data" => $datas,
            "stepid" => time()
        ) ;
        $this->Fsession["steps"][]=$step ;
        //send last step to the cache to be pushed to client should be faster then anything else !
        //$this->cache->set('WhiteboardSession::'.$this->file,json_encode($step))  ;
        $this->setLastStep($step) ;
        return $this-> updateStorage() ;

    }

    public function getSteps($fromStep,$handleCheckpoint = FALSE ) {
        $result = Array() ;
        foreach ($this->Fsession["steps"] as $step) {
            // if save step then dont send step before this one
            if ($step["type"] == "save" && $handleCheckpoint == TRUE ) {
                $result = [] ;
            } else {
                if ($step["stepid"] > $fromstep) {
                    $result[] = $step ;
                }
            }
        }
        return  $result ;
    }

    public function getUserList() {
        return $this->Fsession["user"] ;
    }

    public function waitForNewSteps(){
        
        $timeout = 20 ;
        $elapsedTime = 0;

        while (empty($step) && $elapsedTime < $timeout) {
            sleep(1) ;
            //$step = json_decode($this->cache->get('WhiteboardSession::'.$this->file)) ;
            $step = $this->getLastStep() ;
            $elapsedTime++ ;
            return $step ;
        } ;
        //remove key from cache 
        //$this->cache.remove('WhiteboardSession::'.$this->file) ;
        return $step ;
    }
    
    /* Private methods */

    private function updateStorage() {
        $payload = json_encode($this->Fsession) ;
        $result = file_put_contents("/tmp/session-".$this->file,$payload) ;
        return $result ;
    }

    private function getUserNumber() {
        return count($this->Fsession["user"]) ; 
    }

    private function sessionDestroy() {
        return unlink("/tmp/session-".$this->file) ;
    }

    private function setLastStep($step){
        $jstep = json_encode($step) ;
        file_put_contents("/tmp/session-queue-".$this->file,jstep,FILE_APPEND) ;
    }

    private function getLastStep(){

        $step = file_get_contents("/tmp/session-queue-".$this->file) ;

        return json_decode($step,true) ;

    }


} 