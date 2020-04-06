!function(t){function e(e){for(var n,o,r=e[0],a=e[1],s=0,l=[];s<r.length;s++)o=r[s],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&l.push(i[o][0]),i[o]=0;for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n]);for(c&&c(e);l.length;)l.shift()()}var n={},i={0:0};function o(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.e=function(t){var e=[],n=i[t];if(0!==n)if(n)e.push(n[2]);else{var r=new Promise((function(e,o){n=i[t]=[e,o]}));e.push(n[2]=r);var a,s=document.createElement("script");s.charset="utf-8",s.timeout=120,o.nc&&s.setAttribute("nonce",o.nc),s.src=function(t){return o.p+""+({1:"vendors~literallycanvas"}[t]||t)+".js"}(t);var c=new Error;a=function(e){s.onerror=s.onload=null,clearTimeout(l);var n=i[t];if(0!==n){if(n){var o=e&&("load"===e.type?"missing":e.type),r=e&&e.target&&e.target.src;c.message="Loading chunk "+t+" failed.\n("+o+": "+r+")",c.name="ChunkLoadError",c.type=o,c.request=r,n[1](c)}i[t]=void 0}};var l=setTimeout((function(){a({type:"timeout",target:s})}),12e4);s.onerror=s.onload=a,document.head.appendChild(s)}return Promise.all(e)},o.m=t,o.c=n,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(n,i,function(e){return t[e]}.bind(null,i));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o.oe=function(t){throw console.error(t),t};var r=window.webpackJsonpWhiteboard=window.webpackJsonpWhiteboard||[],a=r.push.bind(r);r.push=e,r=r.slice();for(var s=0;s<r.length;s++)e(r[s]);var c=a;o(o.s=0)}([function(e,n,i){"use strict";i.r(n);
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
 */var o={name:"editor",start:function(t,e,n){var i=this;this.app_name=t,this.filename=e,this.context=n,this.init().then((function(){i.loadContent(),i.setupCallback()}))},init:function(){return i.e(1).then(i.t.bind(null,65,7)).then(t=>{this.whiteboard=t.init(document.getElementById(this.app_name+"-editor"),{imageURLPrefix:OC.linkTo(this.app_name,"img/lc_assets"),toolbarPosition:"top"})})},loadContent:function(){var t=this,e=OC.generateUrl("apps/"+this.app_name+"/file/load");$.ajax({type:"GET",url:e,data:{path:this.context.dir+"/"+this.filename}}).done((function(e){console.log("Loading WB ..."),t.whiteboard.loadSnapshot(JSON.parse(e))}))},saveContent:function(){var t=OC.generateUrl("apps/"+this.app_name+"/file/save"),e={content:JSON.stringify(this.whiteboard.getSnapshot()),path:this.context.dir+"/"+this.filename};$.ajax({type:"POST",url:t,data:e}).done((function(t){console.log("Save whiteboard ...")}))},setupCallback:function(){var t=this;this.whiteboard.on("drawingChange",(function(){t.saveContent()}))},close:function(){this.whiteboard.teardown()}},r={name:"ApplicationPrototype",initialise:function(t,e,n){this.APP_NAME=t,this.APP_EXT=e,this.APP_MIME=n,this.NewFileMenu.APP_NAME=t,this.NewFileMenu.APP_EXT=e,this.NewFileMenu.APP_MIME=n,this.container="<div id="+this.APP_NAME+"-container><div id="+this.APP_NAME+"-editor></div></div>",this.closebtn="<div id="+this.APP_NAME+"-closebtn class=icon-close></div>",this.savebtn="<div id="+this.APP_NAME+"-savebtn class=icon-save></div>",OC.Plugins.register("OCA.Files.NewFileMenu",this.NewFileMenu),this.registerFileActions()},setupContainer:function(){var t=this;$("#content").append(this.container).addClass("viewer-mode").addClass("no-sidebar"),$("#"+this.APP_NAME+"-container").append(this.closebtn),$("#"+this.APP_NAME+"-closebtn").click((function(){o.close(),$("#"+t.APP_NAME+"-container").remove(),$("#content").removeClass("viewer-mode").removeClass("no-sidebard")})),$("#"+this.APP_NAME+"-container").append(this.savebtn),$("#"+this.APP_NAME+"-savebtn").click((function(){o.saveContent()}))},registerFileActions:function(){var t=this;OCA.Files.fileActions.registerAction({name:"Edit",mime:this.APP_MIME,permissions:OC.PERMISSION_READ,icon:function(){return OC.imagePath("core","actions/edit")},actionHandler:function(e,n){t.setupContainer(),t.editAction(e,n)}}),OCA.Files.fileActions.setDefault(this.APP_MIME,"Edit")},editAction:function(t,e){o.start(this.APP_NAME,t,e)},NewFileMenu:{attach:function(e){var n=this,i=e.fileList;"files"===i.id&&e.addMenuEntry({id:this.APP_NAME,displayName:t(this.APP_NAME,"New "+this.APP_NAME),templateName:t(this.APP_NAME,"New "+this.APP_NAME+"."+this.APP_EXT),iconClass:"icon-"+this.APP_NAME,fileType:this.APP_MIME,actionHandler:function(t){i.getCurrentDirectory();i.createFile(t).then((function(){console.log("New "+n.APP_NAME)}))}})}}};
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
 */i.nc=btoa(OC.requestToken),i.p=OC.linkTo("whiteboard","js/"),OCA.whiteboard=r,$(document).ready((function(){OCA.whiteboard.initialise("whiteboard","wbr","application/wbr")}))}]);
//# sourceMappingURL=main.js.map