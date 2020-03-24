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

        var contenair = "<div id=whiteboard-container></div>" ;
        
        this.registerFileActions() ;


    },

    setupContainer: function() {
        $('#content')
            .add(this.contenair)
            .addClass("viewer-mode")
            .addClass("no-sidebar") ;
    },


    // register file handler
    registerFileActions: function() {

        var self = this ;

        OCA.Files.fileActions.registerAction({
            name: 'Edit',
            mime: "application/wbr",
            permissions: OC.PERMISSION_READ,
            icon: function () {
                return OC.imagePath('core', 'actions/edit');
            },
            actionHandler: self.editAction
        }) ;
        
        OCA.Files.fileActions.setDefault("application/wbr", 'Edit');

    },

    //edit
    editAction: function(filename,context) {
        
        //self.setupContainer() ;

        var closebtn ="<div id=closebtn class=icon-close><div>" ;

        var contenair = "<div id=whiteboard-container></div>" ;
        $('#content')
            .append(contenair)
            .addClass("viewer-mode")
            .addClass("no-sidebar") ;


        import(/* webpackChunkName: "literallycanvas" */  "literallycanvas").then(LC => {

            var WB= LC.init(
                document.getElementById('whiteboard-container'),
                {
                    imageURLPrefix: '/stable18/apps/whiteboard/img/lc_assets' ,
                    toolbarPosition: 'top'
                }                
            );

            // create close button
            $('#whiteboard-container') .append(closebtn) ;

            $("#closebtn").click(function(){
                WB.teardown() ;
                $('#whiteboard-container').remove() ;
                $('#content').removeClass("viewer-mode").removeClass("no-sidebard") ;
            }) ;

            //load whiteboard
            var url = OC.generateUrl('apps/whiteboard/file/load');
            $.ajax({
                type: 'GET',
                url: url,
                data: {path: context.dir + "/" + filename }
            }).done(function(content){
                console.log("loading done") ;
                WB.loadSnapshot(JSON.parse(content)) ;
            })
            
            // set save callback
            WB.on('drawingChange', function() {
                console.log("Save WB ...") ;

                var url = OC.generateUrl('apps/whiteboard/file/save');
                console.log(url) ;

                var putObject = {
                    content: JSON.stringify(WB.getSnapshot()),
                    path: context.dir + "/" + filename
                };

                $.ajax({
                    type: 'POST',
				    url: url,
				    data: putObject
                })

            }) ;

        }) ; 

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

__webpack_nonce__ = btoa(OC.requestToken)
__webpack_public_path__ = OC.linkTo('whiteboard', 'js/');
