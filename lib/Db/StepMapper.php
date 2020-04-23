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
use OCA\whiteboard\Db\Step ;


Class StepMapper extends QBMApper {

    public function __construct(IDBConnection $db) {
		  parent::__construct($db, 'cengine_steps', Step::class) ;
    }
    
    public function findLasts(string $app_id, int $file_id, string $user_id) {
        $qb = $this->db->getQueryBuilder();

        $qb->select('*')
                ->from($this->getTableName())
                ->where(
                  $qb->expr()->eq('app_id', $qb->createNamedParameter($app_id, IQueryBuilder::PARAM_STR))
                  )->andWhere(
                    $qb->expr()->eq('file_id', $qb->createNamedParameter($file_id, IQueryBuilder::PARAM_INT))
                  )->andWhere(
                    $qb->expr()->neq('step_type',$qb->createNamedParameter('save', IQueryBuilder::PARAM_STR))
                  )->andWhere(
                    $qb->expr()->notlike('step_forwarded',  $qb->createNamedParameter('%' . $this->db->escapeLikeParameter($user_id) . '%'))
                  )->orWhere(
                    $qb->expr()->isNull('step_forwarded')
                  )
                 ->orderBy('step_id', 'ASC') ;

                 
          return $this->findEntities($qb) ;
  
        
    }

    public function findAll(string $app_id, int $file_id) {
      $qb = $this->db->getQueryBuilder();

      $sub = $this->db->getQueryBuilder() ;

      $sub->select('*')
              ->from($this->getTableName())
              ->Where( 
                $sub->expr()->eq('step_type',$sub->createNamedParameter('save', IQueryBuilder::PARAM_STR))
                )
              ->orderBy('step_id','DESC')
              ->setMaxResults(1) ;
      
      $lastSave = $this->findEntity($sub) ;

      $qb->select('*')
              ->from($this->getTableName())
              ->Where(
                $qb->expr()->eq('app_id', $qb->createNamedParameter($app_id, IQueryBuilder::PARAM_STR))
              )->andWhere(
                $qb->expr()->eq('file_id', $qb->createNamedParameter($file_id, IQueryBuilder::PARAM_INT))
              );
              
      if (count($lastSave) != 0) {
        $qb->andWhere(
                $qb->expr()->gt('step_id',$qb->createNamedParameter($lastSave->getStepId(), IQueryBuilder::PARAM_INT))
        );
      } ;

      $qb->orderBy('step_id','ASC') ;
          
     return $this->findEntities($qb) ; 
  }

  public function removeAll(int $file_id) {

    $qb = $this->db->getQueryBuilder();
    $qb->delete('cengine_steps')
      ->where(
        $qb->expr()->eq('file_id', $qb->createNamedParameter($file_id, IQueryBuilder::PARAM_INT))
      ) ;

      $qb->execute() ;
  }


}