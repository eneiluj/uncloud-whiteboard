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
import collaborationEngine from './collaboration.js' ;
import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'

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
    
        OC.Plugins.register("OCA.Files.NewFileMenu", this.NewFileMenu);
        this.registerFileActions() ;

    },

    //create container + handle close button
    setupContainer: function(filename,context) {

        var self = this ;

        $('#content')
            .append(this.container)
            .addClass("viewer-mode")
            .addClass("no-sidebar") ;
        
        //close button
        this.closebtn  = "<div id="+this.APP_NAME+"-closebtn class=icon-close></div>" ;
        $('#'+this.APP_NAME+'-container').append(this.closebtn) ;
        $("#"+this.APP_NAME+"-closebtn").click(function (){
            self.stopEdit() ;
        }) ;

        //save button
        this.savebtn   = "<div id="+this.APP_NAME+"-savebtn class=icon-save></div>" ;
        $('#'+this.APP_NAME+'-container').append(this.savebtn) ;
        $("#"+this.APP_NAME+"-savebtn").click(function(){
            self.saveEdit() ;
        }) ;

        //share button
        this.sharebtn   = "<div id="+this.APP_NAME+"-sharebtn class=icon-menu-sidebar></div>" ;
        $('#'+this.APP_NAME+'-container').append(this.sharebtn) ;
        $("#"+this.APP_NAME+"-sharebtn").click(function(){
            OCA.Files.Sidebar.open( context.dir + "/" + filename) ;
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
                self.setupContainer(filename,context) ;
                self.startEdit(filename,context) ;
            }
        }) ;
        
        OCA.Files.fileActions.setDefault(this.APP_MIME, 'Edit');

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
    },

    // start editing
    startEdit: function(filename,context) {
        
        var self = this ;

        // start the editor
        this.ED = editor;
        this.ED.start(this.APP_NAME,filename,context) ;

        //start the collaboration Engine
        this.CE = collaborationEngine ;
        this.CE.start(this.APP_NAME,filename,context) ;

        // subscribtion to event bus
        // local changes => send to Engine
        subscribe(this.APP_NAME+"::editorAddStep",this.EDS = (data) => {
            self.CE.sendStep(data).then(function(){
                console.log("CE: sendingStep Done",data) ;
            }) ;
        }) ;

        // engine sent us changes => forward to editor
        subscribe(this.APP_NAME+"::externalAddStep",this.EAS = (data) => {
            self.ED.applyChange(data) ;
        });

        // engine tells us hat someone arrived into the session
        //subscribe(this.APP_NAME+"::newUser",this.addUser) ;
        
    },

    //stop editing
    stopEdit: function() {
        // unsubscribe from bus event
        unsubscribe(this.APP_NAME+"::editorAddStep",this.EDS)   ;
        unsubscribe(this.APP_NAME+"::externalAddStep",this.EAS) ;

        //stop collaboration Engine
        this.CE.stop() ;

        //close editor
        this.ED.stop() ;

        // remove app container
        $('#'+this.APP_NAME+'-container').remove() ;
        $('#content').removeClass("viewer-mode").removeClass("no-sidebard") ;
    },

    //save edit
    saveEdit: function() {
        this.ED.saveContent() ;
    },

} ;
