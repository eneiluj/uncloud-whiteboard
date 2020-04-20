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
import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'

export default { 
    name: "editor",

    start: function (app_name,filename,context) {

        var self = this ;
        
        this.app_name = app_name ;
        this.filename = filename ;
        this.context  = context  ;

        this.init().then(function(){
                self.loadContent()   ;
                self.setupCallbacks() ;
        }) ;

    },
    
    init: function () {
        return import(/* webpackChunkName: "literallycanvas" */  "literallycanvas").then(LC => {
            this.LC = LC ;
            this.whiteboard = LC.init(
                    document.getElementById(this.app_name+'-editor'),
                    {
                        imageURLPrefix: OC.linkTo(this.app_name,'img/lc_assets') ,
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
            //console.log("WB : loaded") ;
            if (content.trim() != "" ) {
                self.whiteboard.loadSnapshot(JSON.parse(content)) ;
            } ;
        }) ;
    },

    //save whiteboard
    saveContent: function() {

        var self = this ;
        
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
            OC.Notification.showTemporary("File saved") ;
            var payload = {
                'type' : 'save',
                'step' : 'NA'
            } ;
            emit(self.app_name+"::editorAddStep",payload) ;
        })

    },

    //setup callback
    setupCallbacks: function (){
            var self = this ;

            // set save callback
            //this.whiteboard.on('drawingChange', function(data) {

                //emit(self.app_name+"::editorContentChange",data) ,

                //self.saveContent() ;        
            //});

            this.whiteboard.on('shapeSave', function(data) {
                var payload = {
                    'type' : 'shapeSave',
                    'step' : self.LC.shapeToJSON(data.shape)
                } ;
                emit(self.app_name+"::editorAddStep",payload) ;
                console.log("ED: Creating NewShape ") ;
                return data ;
            });

    },

    //destroy editor 
    stop: function() {
        this.whiteboard.teardown() ;
    },

    applyChange: function(step) {
        switch (step.stepType) {
            case 'shapeSave':
                    var shapeStep = this.LC.JSONToShape(JSON.parse(step.stepData)) ;
                    this.whiteboard.saveShape(shapeStep,false) ;
                break ;
            default: console.warn("unknown step type")
        }
        
    },

}