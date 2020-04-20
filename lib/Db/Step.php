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

namespace OCA\whiteboard\Db ;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Step extends Entity implements JsonSerializable {

    protected $appId;
    protected $userId;
    protected $stepId;
    protected $stepType;
    protected $stepForwarded;
    protected $stepData;
    protected $fileId ;

    public function __construct() {
        $this->addType("id",integer) ;
        $this->addType("appId",string) ;
        $this->addType("userId",string) ;
        $this->addType("fileId",integer) ;
        $this->addType("stepId",integer) ;
        $this->addType("stepType",string) ;
        $this->addType("stepData",string) ;
        $this->addType("stepForwarded",string) ;
    }

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'appId' => $this->appId,
            'userId' => $this->userId,
            'fileId' => $this->fileId,
            'stepData' => $this->stepData,
            'stepId'=> $this->stepId,
            'stepType' => $this->stepType,
            'stepForwarded' => $this->stepForwarded
        ];
    }

}
