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

import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus' ;
/**
* @namespace collaborationEngine
*/
export default {

    name: 'collaborationEngine',

    start: function(app_name,filename,context) {

        var self = this ;

        this.app_name = app_name  ;
        this.filename  = filename ;
        this.context = context ;

        this.SSE_URL = OC.generateUrl('apps/'+this.app_name+'/collaboration/event'); 
        this.SSE_OPT = {withCredentials:true} ;

        this.init().then(function(data) {
            console.log("Collaboration started for "+ self.app_name) ;
            self.addUser() ;

            // because we may arrive in an allready running session
            // get all steps from last last save 
            self.getSteps(0,true).then(function(steps){
                steps.forEach(step => emit(self.app_name+"::externalAddStep",step)) ;
            })
            
            // start pulling for change
            self.startCommunication() ;
        });
        
    },

    stop: function() {
        this.removeUser() ;
    },

    init: function() {
        var url = OC.generateUrl('apps/'+this.app_name+'/collaboration/startsession');
        this.id = window.FileList.findFile(this.filename).id

        var ajx =  $.ajax({
            type: 'POST',
            url: url,
            data: {id: this.id }
        }) ;    
        return ajx.promise() ;
    },

    addUser: function() {
        var url = OC.generateUrl('apps/'+this.app_name+'/collaboration/adduser');
        console.log("Adding user " + OC.currentUser ) ;

        var ajx = $.ajax({
            type: 'POST',
            url: url,
            data: {id: this.id,
                   user: OC.currentUser
                  }
        }) ;
        return ajx.promise() ;
    },

    removeUser: function() {
        var url = OC.generateUrl('apps/'+this.app_name+'/collaboration/removeuser');
        console.log("Removing user " + OC.currentUser ) ;

        var ajx = $.ajax({
            type: 'POST',
            url: url,
            data: {id: this.id,
                   user: OC.currentUser
                  }
        }) ;
        return ajx.promise() ;
    },

    sendStep: function(payload) {

        var url = OC.generateUrl('apps/'+this.app_name+'/collaboration/addstep');

        var ajx = $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
            url: url,
            data: JSON.stringify({id: this.id,
                   user: OC.currentUser,
                   type: payload.type,
                   step: payload.step
                  })
        }) ;

        return ajx.promise() ;

    },

    getSteps: function(from,handlecheckpoint) {
        var url = OC.generateUrl('apps/'+this.app_name+'/collaboration/getsteps');
        console.log("get initial steps") ;
        var ajx = $.ajax({
            type: 'GET',
            url: url,
            data: {
                   id: this.id,
                   fromStep: from,
                   handlecheckpoint: handlecheckpoint
                  }
        }) ;

        return ajx.promise() ;
    },

    startCommunication: function() {
        this.communicationStarted = true ;

        while (this.communicationStarted = true) {
            this.longPull().done( function(data){
                console.log(data) ;
            })
        }

    },

    longPull: function() {
        var url = OC.generateUrl('apps/'+this.app_name+'/collaboration/pushstep');
        console.log("Starting polling ...") ;
        var ajx = $.ajax({
            type: 'GET',
            url: url,
            data: {
                   id: this.id,
                  }
        }) ;

        return ajx.promise() ;

    },

    stopCommunication: function(){
       this.communicationStarted = false ;
        // this.source.close() ;
    }

}
