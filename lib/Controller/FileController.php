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
use OCP\IRequest;
use OCP\Files\File;
use OCP\Files\Folder;

class FileController extends Controller {
	public function __construct($AppName, IRequest $request, Folder $userFolder) {
		parent::__construct($AppName, $request);

		//$this->request = $request ;
		$this->userFolder = $userFolder;
	}

	/**
	 * @NoAdminRequired
	 */
	public function save($path,$content) {

	   /** @var File $file */
		$file = $this->userFolder->get($path);
		$file->putContent($content);
	}

	/**
	 * @NoAdminRequired
	 */
	public function load($path) {

	   /** @var File $file */
		$file = $this->userFolder->get($path);
		return $file->getContent();
	}
}
