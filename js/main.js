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
* @namespace whiteboard
*/
whiteboardApp = {


    // App init
    initialise: function() {
         this.registerFileActions() ;
    },


    // register file handler
    registerFileActions: function() {

        var self = this ;

        OCA.Files.fileActions.registerAction({
            name: 'Edit',
            mime: "application/wbr",
            actionHandler: self.editAction,
            permissions: OC.PERMISSION_READ,
            icon: function () {
                return OC.imagePath('core', 'actions/edit');
            }
        }) ;
        
        OCA.Files.fileActions.setDefault("application/wbr", 'Edit');

    },

    //edit
    editAction: function(filename,context) {
        
        dir = context.dir ;

        var ncClient = OC.Files.getClient();

        fo = ncClient.getFileInfo(dir + "/" + filename) ;

        console.log( fo) ;
    }
 
} ;

whiteboardApp.NewFileMenu = {
    attach: function (menu) {

        var fileList = menu.fileList;
            if (fileList.id !== "files") {
                return;
            }

        menu.addMenuEntry({
            id: "whiteboard",
            displayName:  t('whiteboard', "New whiteboard"),
            templateName: t('whiteboard', "New whiteboard.wbr"),
            iconClass: "icon-whiteboard",
            fileType: "application/wbr",
            actionHandler: function (fileName) {
                var dir = fileList.getCurrentDirectory();
                fileList.createFile(fileName)
                .then(function () {
                    console.log("new whiteboard") ;
                });
            }
        }); 
    }
} ;




OCA.whiteboard = whiteboardApp ;

OC.Plugins.register("OCA.Files.NewFileMenu", whiteboardApp.NewFileMenu);

$(document).ready(function () {

    console.log("Whiteboard registered") ;

    OCA.whiteboard.initialise() ;


});
