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

//use OCP\User ;

//class SimpleFileCollaborationEngine implements ICollaborationEngine {
class SimpleFileCollaborationEngine {

    public function __construct(string $fileId) {

        $this->file = $fileId ;
        $this->Fsession =Array() ;
        $this->Fsession = json_decode(file_get_contents("/tmp/session-".$this->file),true) ;

    }

    public function createSession(string $file) {
        $this->Fsession["session"] = $file ;
        return $this-> updateStorage() ;

    } 

    public function addUSer(string $user) {
        $this->Fsession["user"][]=$user ;
        return $this-> updateStorage() ;

    } 

    public function addStep($datas) {
        $step = array (
            "data" => $datas,
            "stepid" => "1"
        ) ;
        $this->Fsession["steps"][]=$step ;
        return $this-> updateStorage() ;

    }

    public function getStep() {
        return  $this->Fsession["steps"] ;
    }
    
    
    private function updateStorage() {
        return file_put_contents("/tmp/session-".$this->file,json_encode($this->Fsession)) ;
    }


} 