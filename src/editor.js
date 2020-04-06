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

export default { 
    name: "editor",

    start: function (app_name,filename,context) {

        var self = this ;
        
        this.app_name = app_name ;
        this.filename = filename ;
        this.context  = context  ;

        this.init().then(function(){
                self.loadContent()   ;
                self.setupCallback() ;

        }) ;

    },
    
    init: function () {
        return import(/* webpackChunkName: "literallycanvas" */  "literallycanvas").then(LC => {
            this.whiteboard = LC.init(
                    document.getElementById(this.app_name+'-editor'),
                    {
                        imageURLPrefix: '/stable18/apps/'+this.app_name+'/img/lc_assets' ,
                        toolbarPosition: 'top'
                    }                
                )
        }) ;
    },

    //load whiteboard
    loadContent: function() {
        
        var self = this ;
        var url = OC.generateUrl('apps/'+this.app_name+'/file/load');

        $.ajax({
            type: 'GET',
            url: url,
            data: {path: this.context.dir + "/" + this.filename }
        }).done(function(content){
            console.log("Loading WB ...") ;
            self.whiteboard.loadSnapshot(JSON.parse(content)) ;
        }) ;
    },

    //save whiteboard
    saveContent: function() {
        var url = OC.generateUrl('apps/'+this.app_name+'/file/save');

        var postObject = {
            content: JSON.stringify(this.whiteboard.getSnapshot()),
            path: this.context.dir + "/" + this.filename
        };

        $.ajax({
            type: 'POST',
            url: url,
            data: postObject
        }).done(function(content){
            console.log("Save whiteboard ...") ;
        })
    },

    //setup callback
    setupCallback: function (){
            var self = this ;

            // set save callback
            this.whiteboard.on('drawingChange', function() {
                self.saveContent() ;        
            });
    },

    //destroy editor 
    close: function() {
        this.whiteboard.teardown() ;
    }
}


/*if (CONF_MASTER == true) {
                $('#closebtn').addClass("master") ;
            } else {
                setInterval(() => {
                    //load whiteboard
                    var url = OC.generateUrl('apps/whiteboard/file/load');
                    $.ajax({
                        type: 'GET',
                        url: url,
                        data: {path: context.dir + "/" + filename }
                    }).done(function(content){
                        console.log("update WB ...") ;
                        WB.loadSnapshot(JSON.parse(content)) ;
                    })
                }, 300);
            }*/

            /*require("./collaboration.js") ;

            collaborationEngine.startSession(filename)
                .done(function(){
                    console.log("session started")
                    collaborationEngine.addUser(filename) ;
                }) ;

            */