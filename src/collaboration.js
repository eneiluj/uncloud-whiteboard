/**
 * @author Matthieu Le Corre <matthieu.lecorre@univ-nantes.fr>
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

 
/**
* @namespace collaborationEngine
*/
collaborationEngine = {

    startSession: function(filename) {
        var url = OC.generateUrl('apps/whiteboard/collaboration/createsession');
        var id = window.FileList.findFile(filename).id
        console.log("Create session for id #"+id) ;
        ajx =  $.ajax({
            type: 'POST',
            url: url,
            data: {id: id }
        }) ;    
        return ajx.promise() ;
    },

    addUser: function(filename) {
        var url = OC.generateUrl('apps/whiteboard/collaboration/adduser');
        var id = window.FileList.findFile(filename).id
        console.log("Adding user " + OC.currentUser ) ;

        ajx = $.ajax({
            type: 'POST',
            url: url,
            data: {id: id,
                   user: OC.currentUser
                  }
        }) ;
        return ajx.promise() ;
    }

}
