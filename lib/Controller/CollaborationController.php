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
use OCP\IRequest;;
use OCP\User ;
use OCP\ICache ;
use OCP\ICacheFactory;
use OCA\whiteboard\Collaboration\CollaborationEngine ;

class CollaborationController extends Controller {
    /**
     * @NoAdminRequired
     * 
     **/
    public function __construct($AppName,IRequest $request,ICacheFactory $cacheFactory, CollaborationEngine $engine) {

        parent::__construct($AppName, $request);

        //$this->id = $request->getParam("id") ;
    
        $this->engine = $engine ;

    }

    /**
     * @NoAdminRequired
     * 
     **/
    public function startSession($id) {
        return $this->engine->startSession($id) ;
    }

    /**
     * @NoAdminRequired
     * 
     **/
    public function addUser($id,$user) {
        return $this->engine->addUser($id,$user) ;
    }

    /**
     * @NoAdminRequired
     * 
     **/
    public function removeUser($id,$user) {
        return $this->engine->removeUser($id,$user) ;
    }

    /**
     * @NoAdminRequired
     * 
     **/
    public function getUserList($id) {
        return $this->engine->getUserList() ;
    }

    /**
     * @NoAdminRequired
     * 
     * @param int $id
     * @param string $user
     * @param string $type
     * @param string $step
     * 
     **/
    public function addStep(int $id,string $user,string $type, string $step) {
        return $this->engine->addStep($id,$user,$type,$step) ;
    }

    /**
     * @NoAdminRequired
     * 
     **/
    public function getSteps($id) {
        return $this->engine->getSteps($id) ;
    }

    /**
     * @NoAdminRequired
     * 
     **/
    public function pushStep(int $id,string $user) {
        return $this->engine->waitForNewSteps($id,$user) ;
    }
}