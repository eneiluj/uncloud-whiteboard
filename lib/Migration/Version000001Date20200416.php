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

namespace OCA\whiteboard\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;

class Version000001Date20200416 extends SimpleMigrationStep {

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		// Session
		if (!$schema->hasTable('cengine_steps')) {
			$table = $schema->createTable('cengine_steps');
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);
			$table->addColumn('app_id', 'string', [
				'notnull' => true,
				'length' => 200
			]);
			$table->addColumn('user_id', 'string', [
				'notnull' => true,
				'length' => 200,
			]);
			$table->addColumn('file_id', 'integer', [
				'notnull' => true,
			]);
			$table->addColumn('step_data', 'text', [
				'notnull' => true,
				'default' => ''
			]);
			$table->addColumn('step_id', 'bigint', [
				'notnull' => true,
				'unsigned'=> true
			]);
			$table->addColumn('step_forwarded', 'text', [
				'notnull' => false,
			]);
			$table->addColumn('step_type', 'string', [
				'notnull' => true,
				'length' => 200
			]);
			$table->setPrimaryKey(['id']);
			$table->addIndex(['app_id'], 'cengine_steps_app');
		}

		// Users
		if (!$schema->hasTable('cengine_users')) {
			$table = $schema->createTable('cengine_users');
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);
			$table->addColumn('app_id', 'string', [
				'notnull' => true,
				'length' => 200
			]);
			$table->addColumn('user_id', 'string', [
				'notnull' => true,
				'length' => 200,
			]);
			$table->addColumn('file_id', 'integer', [
				'notnull' => true,
			]);
			$table->addColumn('last_seen', 'bigint', [
				'notnull' => true,
				'unsigned'=> true
			]);

			$table->setPrimaryKey(['id']);
			$table->addIndex(['app_id'], 'cengine_users_app');
		}
		return $schema;
	}
}
