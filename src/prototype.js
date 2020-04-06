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

import editor from './editor.js' ;

/**
* @namespace ApplicationPrototype
*/
export default {
    name: 'ApplicationPrototype',

    // App init
    initialise: function(APP_NAME,APP_EXT, APP_MIME) {

        this.APP_NAME = APP_NAME ;
        this.APP_EXT  = APP_EXT  ;
        this.APP_MIME = APP_MIME ;

        this.NewFileMenu.APP_NAME = APP_NAME ;
        this.NewFileMenu.APP_EXT  = APP_EXT  ;
        this.NewFileMenu.APP_MIME = APP_MIME ;

        this.container = "<div id="+this.APP_NAME+"-container><div id="+this.APP_NAME+"-editor></div></div>"   ;
        this.closebtn  = "<div id="+this.APP_NAME+"-closebtn class=icon-close></div>" ;
        this.savebtn   = "<div id="+this.APP_NAME+"-savebtn class=icon-save></div>" ;

        OC.Plugins.register("OCA.Files.NewFileMenu", this.NewFileMenu);
        this.registerFileActions() ;

    },

    //create container + handle close button
    setupContainer: function() {

        var self = this ;

        $('#content')
            .append(this.container)
            .addClass("viewer-mode")
            .addClass("no-sidebar") ;
        
        //close button
        $('#'+this.APP_NAME+'-container').append(this.closebtn) ;
        $("#"+this.APP_NAME+"-closebtn").click(function(){
            editor.close() ;
            $('#'+self.APP_NAME+'-container').remove() ;
            $('#content').removeClass("viewer-mode").removeClass("no-sidebard") ;
        }) ;

        //save button
        $('#'+this.APP_NAME+'-container').append(this.savebtn) ;
        $("#"+this.APP_NAME+"-savebtn").click(function(){
            editor.saveContent() ;
        }) ;

    },


    // register file handler
    registerFileActions: function() {

        var self = this ;

        OCA.Files.fileActions.registerAction({
            name: 'Edit',
            mime: this.APP_MIME,
            permissions: OC.PERMISSION_READ,
            icon: function () {
                return OC.imagePath('core', 'actions/edit');
            },
            actionHandler: function(filename,context) {
                self.setupContainer() ;
                self.editAction(filename,context) ;
            }
        }) ;
        
        OCA.Files.fileActions.setDefault(this.APP_MIME, 'Edit');

    },

    //edit
    editAction: function(filename,context) {
        editor.start(this.APP_NAME,filename,context) ;
    },
 
    // register "New" in file app 
    NewFileMenu: {

        attach: function (menu) {
            
            var self = this ;

            var fileList = menu.fileList;
                if (fileList.id !== "files") {
                    return;
                }

            menu.addMenuEntry({
                id: this.APP_NAME,
                displayName:  t( this.APP_NAME, "New "+ this.APP_NAME),
                templateName: t( this.APP_NAME, "New "+ this.APP_NAME+"."+ this.APP_EXT),
                iconClass: "icon-"+ this.APP_NAME,
                fileType:  this.APP_MIME,
                actionHandler: function (fileName) {
                    var dir = fileList.getCurrentDirectory();
                    fileList.createFile(fileName)
                    .then(function () {
                        console.log("New "+ self.APP_NAME) ;
                    });
                }
            }); 
        }
    }

} ;
