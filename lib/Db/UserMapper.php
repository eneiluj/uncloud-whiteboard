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

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

use OCA\whiteboard\Db\User ;

Class UserMapper extends QBMApper {

    public function __construct(IDBConnection $db) {
		parent::__construct($db, 'cengine_users', User::class) ;
    }
    
    public function find(string $user_id, string $app_id, int $file_id) {
        $qb = $this->db->getQueryBuilder();

        $qb->select('*')
                ->from($this->getTableName())
                ->where(
                  $qb->expr()->eq('user_id', $qb->createNamedParameter($user_id, IQueryBuilder::PARAM_STR))
                )->andWhere(
                  $qb->expr()->eq('app_id', $qb->createNamedParameter($app_id, IQueryBuilder::PARAM_STR))
                )->andWhere(
                  $qb->expr()->eq('file_id', $qb->createNamedParameter($file_id, IQueryBuilder::PARAM_INT))
                );
                
        try {
          return $this->findEntity($qb) ;
        }
        catch (DoesNotExistException $e ) {
          return null ;
        }
    }

    public function findAll(string $app_id, int $file_id) {
      $qb = $this->db->getQueryBuilder();

      $qb->select('*')
              ->from($this->getTableName())
              ->Where(
                $qb->expr()->eq('app_id', $qb->createNamedParameter($app_id, IQueryBuilder::PARAM_STR))
              )->andWhere(
                $qb->expr()->eq('file_id', $qb->createNamedParameter($file_id, IQueryBuilder::PARAM_INT))
              );
          
        return $this->findEntities($qb) ;
    
  }


}