(this["webpackJsonpmeasure-app"]=this["webpackJsonpmeasure-app"]||[]).push([[0],{18:function(t,e,n){},19:function(t,e,n){},21:function(t,e,n){},23:function(t,e,n){},24:function(t,e,n){},25:function(t,e,n){},26:function(t,e,n){},27:function(t,e,n){"use strict";n.r(e);var r=n(0),o=n.n(r),i=n(12),l=n.n(i),c=(n(18),n(19),n(2));function a(t,e,n){var r=document.createElement("a"),o=new Blob([t],{type:n});r.href=URL.createObjectURL(o),r.download=e,r.click(),r.remove()}var u=n(13),s=n(4),d=n(5);function f(t){if(!t.length)return"";var e=t.reduce((function(t,e,n,r){var o=Object(d.a)(e,2),i=o[0],l=o[1],c=Object(d.a)(r[(n+1)%r.length],2),a=c[0],u=c[1];return t.push(i,l,(i+a)/2,(l+u)/2),t}),["M"].concat(Object(s.a)(t[0]),["Q"]));return e.push("Z"),e.join(" ")}var p="http://www.w3.org/2000/svg";function v(t,e){var n=e.x1,r=e.x2,o=e.y1,i=e.y2,l=e.strokeWidth,c=e.stroke,a=void 0===c?"#000":c,u=e.strokeDashArray;t.setAttribute("x1",n.toString()),t.setAttribute("y1",o.toString()),t.setAttribute("x2",r.toString()),t.setAttribute("y2",i.toString()),t.setAttribute("stroke",a),l&&t.setAttribute("stroke-width",l.toString()),u&&t.setAttribute("stroke-dasharray",u)}function h(t,e){var n=e.x,r=e.y,o=e.width,i=e.height,l=e.strokeWidth,c=e.stroke,a=e.fill;t.setAttribute("x",n.toString()),t.setAttribute("y",r.toString()),t.setAttribute("width",o.toString()),t.setAttribute("height",i.toString()),a&&t.setAttribute("fill",a),c&&t.setAttribute("stroke",c),l&&t.setAttribute("stroke-width",l.toString())}function b(t,e){var n=e.x,r=e.y,o=e.rx,i=e.ry,l=e.strokeWidth,c=e.stroke,a=e.fill;t.setAttribute("cx",n.toString()),t.setAttribute("cy",r.toString()),t.setAttribute("rx",o.toString()),t.setAttribute("ry",i.toString()),a&&t.setAttribute("fill",a),c&&t.setAttribute("stroke",c),l&&t.setAttribute("stroke-width",l.toString())}function g(t,e,n,r){var o=e?null===t||void 0===t?void 0:t.getElementById(e):void 0,i=null!==e&&void 0!==e?e:"e".concat((new Date).getTime());if(!o){(o=document.createElementNS(p,n)).setAttribute("id",i);var l=r?null===t||void 0===t?void 0:t.getElementById(r):t;null===l||void 0===l||l.appendChild(o)}return{element:o,id:i}}function y(t,e,n,r,o,i,l,c){t.drawLine({id:e,groupId:n,x1:r,y1:o,x2:i,y2:l,strokeDashArray:c})}function w(t,e,n,r,o,i,l){t.drawRect({id:e,groupId:n,x:r-i/2,y:o-i/2,width:i,height:i,fill:l})}function m(t,e,n,r,o,i,l,c){t.drawCircle({id:e,groupId:n,x:r,y:o,rx:i,ry:i,fill:l,stroke:c})}var x=15,j=function(t){return"w".concat(t.id)},O=function(t){return"p".concat(t.editId)};function E(t,e){var n=j(e);w(t,"w".concat(e.id,"s"),n,e.p1.x,e.p1.y,10,"green")}function k(t,e){var n=t.createGroup(j(e),"walls");m(t,"w".concat(e.id,"c1"),n,e.p1.x,e.p1.y,x,"none","#000"),m(t,"w".concat(e.id,"c2"),n,e.p2.x,e.p2.y,x,"none","#000"),y(t,"w".concat(e.id,"l"),n,e.p1.x,e.p1.y,e.p2.x,e.p2.y),E(t,e),function(t,e){var n=j(e);w(t,"w".concat(e.id,"e"),n,e.p2.x,e.p2.y,10,"red")}(t,e)}function I(t,e,n){var r=t.createGroup(O(e),"guide"),o=n.map((function(n){var o="p".concat(e.editId,"g").concat(n.wall.id);return y(t,o,r,e.x,e.y,n.point.x,n.point.y,"10 10"),o}));t.removeElements((function(t){return!o.includes(t.id)}),r)}function C(t,e){t.removeElement(O(e),"guide")}var M=[],L=[];function S(t){localStorage.setItem("plan",JSON.stringify(t))}function V(t,e){var n,r;null===e||void 0===e||null===(n=e.walls)||void 0===n||n.forEach((function(e){return k(t,e)})),null===e||void 0===e||null===(r=e.notes)||void 0===r||r.forEach((function(e){return t.drawPath(e)}))}function A(t,e){var n,r;null===(n=e.walls)||void 0===n||n.forEach((function(e){return t.removeElement(j(e))})),null===(r=e.notes)||void 0===r||r.filter((function(t){return t.id})).forEach((function(e){return t.removeElement(e.id)}))}var H={settings:function(){var t={stylusMode:!0,magneticMode:!0,wallAlignmentMode:!0,selectedTool:"wall"};try{var e=localStorage.getItem("settings");return e?JSON.parse(e):t}catch(n){}return t}(),pointerDown:!1,scale:2,plan:function(){var t={walls:[],notes:[]};try{var e=localStorage.getItem("plan");if(!e)return t;var n=JSON.parse(e);return console.log("Restored plan",n),n}catch(r){console.log("Failed to restore plan")}return t}()};function P(){var t=Object(c.a)({defaultValues:H}),e=t.control,n=t.getValues,o=t.setValue,i=Object(c.b)({control:e,name:"scale"}),l=Object(c.b)({control:e,name:"plan",disabled:!0}),a=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=Object(r.useRef)(null);return Object(r.useEffect)((function(){var n=e.current,r=null===n||void 0===n?void 0:n.parentElement;if(n&&r){var o=r.getBoundingClientRect(),i=o.width,l=o.height;n.setAttribute("viewBox","0 0 ".concat(i*t," ").concat(l*t)),n.setAttribute("version","1.1"),n.setAttribute("xmlns",p),n.setAttribute("width","".concat(i*t)),n.setAttribute("height","".concat(l*t))}}),[t,e]),{svgRef:e,drawing:{drawLine:function(t){var n=g(e.current,t.id,"line",t.groupId),r=n.element,o=n.id;return v(r,t),o},drawCircle:function(t){var n=g(e.current,t.id,"ellipse",t.groupId),r=n.element,o=n.id;return b(r,t),o},drawRect:function(t){var n=g(e.current,t.id,"rect",t.groupId),r=n.element,o=n.id;return h(r,t),o},createGroup:function(t,n){return g(e.current,t,"g",n).id},removeElement:function(t,n){var r,o=n?null===(r=e.current)||void 0===r?void 0:r.getElementById(n):e.current,i=null===o||void 0===o?void 0:o.querySelector("#".concat(t));null===i||void 0===i||i.remove()},removeElements:function(t,n){var r,o,i=n?null===(r=e.current)||void 0===r?void 0:r.getElementById(n):e.current;null===i||void 0===i||null===(o=i.childNodes)||void 0===o||o.forEach((function(e){t(e)&&e.remove()}))},drawPath:function(t){var n=t.id,r=t.points,o=t.groupId,i=g(e.current,n,"path",o),l=i.element,c=i.id;return t.stroke&&l.setAttribute("fill",t.stroke),l.setAttribute("d",f(Object(u.a)(r,{size:t.strokeWidth,smoothing:.5,thinning:.5}))),c}}}}(i),s=a.svgRef,d=a.drawing,y=function(t,e){return Object(r.useMemo)((function(){return{add:function(t){M.push(t),L=[],S(e)},undo:function(){var n=M.pop();if(n){switch(L.push(n),n.tool){case"wall":var r=(null===n||void 0===n?void 0:n.data).addedWall;e.walls=e.walls.filter((function(t){return t!==r})),t.removeElement(j(r));break;case"cursor":n.data.before.forEach((function(n){e.walls.filter((function(t){return t.id===n.id})).forEach((function(t){t.p1=n.p1,t.p2=n.p2})),k(t,n)}));break;case"pencil":case"eraser":var o=n.data.options;o.id&&(e.notes=e.notes.filter((function(t){return t.id!==o.id})),t.removeElement(o.id));break;case"destroy":n.data.destroyedWalls.forEach((function(n){e.walls.push(n),k(t,n)}))}S(e)}},redo:function(){var n=L.pop();if(n){switch(M.push(n),n.tool){case"wall":var r=(null===n||void 0===n?void 0:n.data).addedWall;e.walls.push(r),k(t,r);break;case"cursor":n.data.after.forEach((function(n){e.walls.filter((function(t){return t.id===n.id})).forEach((function(t){t.p1=n.p1,t.p2=n.p2})),k(t,n)}));break;case"pencil":case"eraser":var o=n.data.options;e.notes.push(o),t.drawPath(o);break;case"destroy":var i=n.data.destroyedWalls;i.forEach((function(e){return t.removeElement(j(e))})),e.walls=e.walls.filter((function(t){return!i.includes(t)}))}S(e)}},clear:function(){M=[],L=[]}}}),[e,t])}(d,l);Object(r.useEffect)((function(){V(d,H.plan)}),[d]);var w=Object(r.useRef)(null);return{drawing:d,drawingRef:s,interactiveRef:w,control:e,getValues:n,setValue:o,commandsHistory:y}}var R,D=o.a.createContext(null),T=function(){var t=o.a.useContext(D);if(null===t)throw new Error("useGlobalContext must be used within an GlobalContext.Provider");return t},N=(n(21),n(1)),W=function(){var t=T(),e=t.drawing,n=t.drawingRef,o=t.control,i=t.setValue,l=Object(c.b)({control:o,name:"plan"}),u=Object(r.useCallback)((function(){return function(t){var e=t.cloneNode(!0),n=document.implementation.createDocumentType("svg","-//W3C//DTD SVG 1.1//EN","http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"),r=document.implementation.createDocument("http://www.w3.org/2000/svg","svg",n);r.replaceChild(e,r.documentElement),a((new XMLSerializer).serializeToString(r).replace(/></g,">\n\r<"),"Plan ".concat((new Date).toLocaleDateString(),".svg"),"image/svg+xml")}(n.current)}),[n]),s=Object(r.useCallback)((function(){a(JSON.stringify(l),"Plan ".concat((new Date).toLocaleDateString(),".json"),"text/plain")}),[l]),d=Object(r.useCallback)((function(){!function(t){var e=document.createElement("input");e.type="file",e.onchange=function(n){if(e.files&&0!==e.files.length){var r=e.files[0],o=new FileReader;o.readAsText(r,"UTF-8"),o.onload=function(e){var n,r=null===(n=e.target)||void 0===n?void 0:n.result;t(r)}}},e.click()}((function(t){try{if(!t)return;A(e,l);var n=JSON.parse(t);console.log("Loaded plan",n),i("plan",n),V(e,n),S(n)}catch(r){console.log("Failed to load plan")}}))}),[l,e,i]);return Object(N.jsxs)("div",{className:"fileActionsContainer",children:[Object(N.jsx)("button",{onClick:u,children:"Save SVG"}),Object(N.jsx)("button",{onClick:s,children:"Save JSON"}),Object(N.jsx)("button",{onClick:d,children:"Load JSON"})]})},B=["title","titleId"];function X(){return(X=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function z(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function G(t,e){var n=t.title,o=t.titleId,i=z(t,B);return r.createElement("svg",X({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:e,"aria-labelledby":o},i),n?r.createElement("title",{id:o},n):null,R||(R=r.createElement("path",{d:"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6V19Z"})))}var J,Z=r.forwardRef(G),F=(n.p,["title","titleId"]);function Y(){return(Y=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function U(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function q(t,e){var n=t.title,o=t.titleId,i=U(t,F);return r.createElement("svg",Y({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:e,"aria-labelledby":o},i),n?r.createElement("title",{id:o},n):null,J||(J=r.createElement("path",{d:"M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"})))}var Q,_=r.forwardRef(q),K=(n.p,["title","titleId"]);function $(){return($=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function tt(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function et(t,e){var n=t.title,o=t.titleId,i=tt(t,K);return r.createElement("svg",$({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:e,"aria-labelledby":o},i),n?r.createElement("title",{id:o},n):null,Q||(Q=r.createElement("path",{d:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"})))}var nt=r.forwardRef(et),rt=(n.p,n(9)),ot=(n(23),function(t){var e=t.icon,n=t.title,r=t.className,o=t.children,i=t.onClick;return Object(N.jsxs)("div",{title:n,className:Object(rt.a)("roundButton",r),onClick:i,children:[e,o]})}),it=(n(24),function(){var t=T(),e=t.drawing,n=t.commandsHistory,r=t.control,o=t.setValue,i=Object(c.b)({control:r,name:"plan"});return Object(N.jsxs)("div",{className:"historyPanel",children:[Object(N.jsx)(ot,{title:"Undo",onClick:n.undo,icon:Object(N.jsx)(nt,{})}),Object(N.jsx)(ot,{title:"Redo",onClick:n.redo,icon:Object(N.jsx)(_,{})}),Object(N.jsx)(ot,{title:"Clear",onClick:function(){if(confirm("Are you sure want to delete all?")){n.clear(),A(e,i);var t={walls:[],notes:[]};o("plan",t),S(t)}},icon:Object(N.jsx)(Z,{})})]})}),lt=function(){var t=T().control,e=Object(c.b)({control:t,name:"pointerDown"});return Object(r.useEffect)((function(){var t=function(t){e&&t.preventDefault()};return document.addEventListener("touchmove",t,{passive:!1}),function(){document.removeEventListener("touchmove",t)}}),[e]),null},ct=(n(25),function(){var t=T(),e=t.control,n=t.setValue,o=Object(c.b)({control:e,name:"settings"}),i=o.stylusMode,l=o.magneticMode,a=o.wallAlignmentMode;return Object(r.useEffect)((function(){!function(t){localStorage.setItem("settings",JSON.stringify(t))}(o)}),[o]),Object(N.jsxs)("div",{className:"settingsList",children:[Object(N.jsx)("div",{children:Object(N.jsx)("b",{children:"Settings"})}),Object(N.jsx)("div",{children:Object(N.jsxs)("label",{children:[Object(N.jsx)("input",{type:"checkbox",checked:null!==i&&void 0!==i&&i,onChange:function(t){return n("settings.stylusMode",t.target.checked)}}),"Stylus mode"]})}),Object(N.jsx)("div",{children:Object(N.jsxs)("label",{children:[Object(N.jsx)("input",{type:"checkbox",checked:null!==a&&void 0!==a&&a,onChange:function(t){return n("settings.wallAlignmentMode",t.target.checked)}}),"Walls alignment"]})}),Object(N.jsx)("div",{children:Object(N.jsxs)("label",{children:[Object(N.jsx)("input",{type:"checkbox",checked:null!==l&&void 0!==l&&l,onChange:function(t){return n("settings.magneticMode",t.target.checked)}}),"Magnet mode"]})}),Object(N.jsx)("a",{href:"https://perfect-freehand-example.vercel.app/",target:"_blank",rel:"noreferrer",children:"Perfect freehand"})]})});function at(t){var e=t.p1,n=t.p2,r=n.x-e.x,o=n.y-e.y;return Math.abs(r)>Math.abs(o)?"horizontal":"vertical"}function ut(t,e){return Math.sqrt((e.x-t.x)*(e.x-t.x)+(e.y-t.y)*(e.y-t.y))}var st=20;function dt(t,e,n){return Math.min(e,n)<=t&&t<=Math.max(e,n)}function ft(t,e){var n,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=t.p1.x,i=t.p1.y,l=t.p2.x,c=t.p2.y,a=e.p1.x,u=e.p1.y,s=e.p2.x,d=e.p2.y;if(c-i!==0){var f=(l-o)/(i-c),p=a-s+(u-d)*f;if(!p)return null;var v=a-o+(u-i)*f;n=v/p}else{if(!(u-d))return null;n=(u-i)/(u-d)}var h=a+(s-a)*n,b=u+(d-u)*n;return r?dt(h,o,l)&&dt(h,a,s)&&dt(b,i,c)&&dt(b,u,d)?{x:h,y:b}:null:{x:h,y:b}}function pt(t,e,n,r){function o(t){return{id:1,x:t.pageX,y:t.pageY,type:"mouse",buttons:t.buttons,changedTouches:[{identifier:1,pageX:t.pageX,pageY:t.pageY}]}}var i=function(t){return e(o(t))},l=function(t){return n(o(t))},c=function(t){return r(o(t))};function a(t){var e=t.changedTouches[0];return{id:e.identifier,x:e.pageX,y:e.pageY,touches:Array.from(t.touches),changedTouches:Array.from(t.changedTouches),type:"stylus"===e.touchType?"stylus":"touch"}}var u=function(t){return e(a(t))},s=function(t){return n(a(t))},d=function(t){return r(a(t))};return t.addEventListener("mousedown",i),t.addEventListener("mousemove",l),t.addEventListener("mouseup",c),t.addEventListener("touchstart",u),t.addEventListener("touchmove",s),t.addEventListener("touchend",d),function(){t.removeEventListener("mousedown",i),t.removeEventListener("mousemove",l),t.removeEventListener("mouseup",c),t.removeEventListener("touchstart",u),t.removeEventListener("touchmove",s),t.removeEventListener("touchend",d)}}function vt(t){return t.filter((function(t){return t.p1.editId||t.p2.editId})).map((function(t){return{id:t.id,p1:{x:t.p1.x,y:t.p1.y},p2:{x:t.p2.x,y:t.p2.y}}}))}var ht,bt=function(){var t=T(),e=t.commandsHistory,n=t.interactiveRef,o=t.drawing,i=t.control,l=t.setValue,a=Object(c.b)({control:i,name:"settings"}),u=a.stylusMode,s=a.magneticMode,d=a.wallAlignmentMode,f=a.selectedTool,p=Object(c.b)({control:i,name:"scale"}),v=Object(c.b)({control:i,name:"plan"});return Object(r.useEffect)((function(){if(n.current&&"cursor"===f){var t=[];return pt(n.current,(function(e){var n;u&&"touch"===e.type||(l("pointerDown",!0),null===(n=e.changedTouches)||void 0===n||n.forEach((function(e){var n=e.identifier,r=e.pageX*p,o=e.pageY*p;v.walls.flatMap((function(t){return[t.p1,t.p2]})).filter((function(t){return ut(t,{x:r,y:o})<=x})).forEach((function(t){t.editId=n})),t=vt(v.walls)})))}),(function(t){var e;("mouse"!==t.type||t.buttons)&&(null===(e=t.changedTouches)||void 0===e||e.forEach((function(t){var e=t.identifier,n=t.pageX*p,r=t.pageY*p,i=v.walls.flatMap((function(t){return[t.p1,t.p2]})).filter((function(t){return t.editId===e}));if(i.forEach((function(t){t.x=n,t.y=r})),s&&i.length>0){var l=function(t,e,n){var r=[];return t.forEach((function(t){Math.abs(t.p1.x-n.x)<st&&(r.push({wall:t,point:t.p1}),e.forEach((function(e){e.x=t.p1.x}))),Math.abs(t.p1.y-n.y)<st&&(r.push({wall:t,point:t.p1}),e.forEach((function(e){e.y=t.p1.y}))),Math.abs(t.p2.x-n.x)<st&&(r.push({wall:t,point:t.p2}),e.forEach((function(e){e.x=t.p2.x}))),Math.abs(t.p2.y-n.y)<st&&(r.push({wall:t,point:t.p2}),e.forEach((function(e){e.y=t.p2.y})))})),r}(v.walls,i,{x:n,y:r});I(o,i[0],l)}v.walls.filter((function(t){return t.p1.editId||t.p2.editId})).forEach((function(t){return k(o,t)}))})))}),(function(n){var r,i;null===(r=n.changedTouches)||void 0===r||r.forEach((function(n){var r=n.identifier;v.walls.flatMap((function(t){return[t.p1,t.p2]})).filter((function(t){return t.editId===r})).forEach((function(t){if(s){var e=v.walls.flatMap((function(t){return[t.p1,t.p2]})).filter((function(e){return e!==t})).find((function(e){return ut(e,t)<=x}));e&&(t.x=e.x,t.y=e.y)}})),v.walls.filter((function(t){return t.p1.editId||t.p2.editId})).forEach((function(t){t.p1.editId=void 0,t.p2.editId=void 0,k(o,t)})),C(o,{editId:r,x:0,y:0}),e.add({tool:"cursor",data:{before:t,after:vt(v.walls)}})})),n.touches&&0!==(null===(i=n.touches)||void 0===i?void 0:i.length)||l("pointerDown",!1)}))}}),[p,u,s,d,e,n,f,v.walls,o,l]),null},gt=function(){var t=T(),e=t.commandsHistory,n=t.interactiveRef,o=t.drawing,i=t.control,l=t.setValue,a=Object(c.b)({control:i,name:"settings"}),u=a.stylusMode,s=a.selectedTool,d=Object(c.b)({control:i,name:"scale"}),f=Object(c.b)({control:i,name:"plan"});return Object(r.useEffect)((function(){if(n.current&&"destroy"===s){var t;return pt(n.current,(function(e){var n=e.x*d,r=e.y*d;u&&"touch"===e.type||"touch"===e.type&&e.touches.length>1||(l("pointerDown",!0),t={x:n,y:r,editId:e.id})}),(function(e){if("mouse"!==e.type||e.buttons){var n=e.x*d,r=e.y*d;o.createGroup("cross","walls"),o.drawLine({id:"d".concat(e.id),x1:t.x,y1:t.y,x2:n,y2:r,stroke:"red",strokeWidth:d,groupId:"cross"});var i={id:"".concat(e.id),p1:t,p2:{x:n,y:r}},l=f.walls.map((function(t){return ft(t,i,!0)})).filter((function(t){return t})).map((function(t,e){var n="x".concat(e);return m(o,n,"cross",t.x,t.y,5,"red"),n}));o.removeElements((function(t){return t.id.startsWith("x")&&!l.includes(t.id)}),"cross")}}),(function(n){var r=n.x*d,i=n.y*d,l={id:"".concat(n.id),p1:t,p2:{x:r,y:i}},c=f.walls.filter((function(t){return ft(t,l,!0)}));c.forEach((function(t){return o.removeElement(j(t))})),f.walls=f.walls.filter((function(t){return!c.includes(t)})),e.add({tool:"destroy",data:{destroyedWalls:c}}),o.removeElement("cross")}))}}),[e,o,n,f,d,s,u,l]),null},yt=n(11),wt=["pencil","eraser"],mt=function(){var t=T(),e=t.commandsHistory,n=t.interactiveRef,o=t.drawing,i=t.control,l=t.setValue,a=Object(c.b)({control:i,name:"settings"}),u=a.stylusMode,s=a.magneticMode,d=a.selectedTool,f=Object(c.b)({control:i,name:"scale"}),p=Object(c.b)({control:i,name:"plan"});return Object(r.useEffect)((function(){if(n.current&&wt.includes(d)){var t,r=[],i=function(){return{strokeWidth:f*("eraser"===d?15:1.5),stroke:"pencil"===d?"#000":"#fff"}};return pt(n.current,(function(e){var n,c;if((!u||"touch"!==e.type)&&!("touch"===e.type&&e.touches.length>1)){l("pointerDown",!0);var a=e.touches&&e.touches[0],s=(null!==(n=null===a||void 0===a?void 0:a.pageX)&&void 0!==n?n:e.x)*f,d=(null!==(c=null===a||void 0===a?void 0:a.pageY)&&void 0!==c?c:e.y)*f;r.push({x:s,y:d,pressure:null===a||void 0===a?void 0:a.force});var p=i(),v=p.stroke,h=p.strokeWidth;t=o.drawPath({points:r,stroke:v,strokeWidth:h,groupId:"pen"})}}),(function(e){var n,l;if((!u||"touch"!==e.type)&&("mouse"!==e.type||e.buttons)){var c=e.touches&&e.touches[0],a=(null!==(n=null===c||void 0===c?void 0:c.pageX)&&void 0!==n?n:e.x)*f,s=(null!==(l=null===c||void 0===c?void 0:c.pageY)&&void 0!==l?l:e.y)*f;r.push({x:a,y:s,pressure:null===c||void 0===c?void 0:c.force});var d=i().strokeWidth;o.drawPath({id:t,points:r,strokeWidth:d})}}),(function(n){var o=i();p.notes||(p.notes=[]);var c=Object(yt.a)(Object(yt.a)({id:t,points:r},o),{},{groupId:"pen"});p.notes.push(c),e.add({tool:d,data:{options:c}}),t=void 0,r=[],n.touches&&0!==n.touches.length||l("pointerDown",!1)}))}}),[f,u,s,n,e,d,o,p,l]),null},xt=["title","titleId"];function jt(){return(jt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function Ot(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function Et(t,e){var n=t.title,o=t.titleId,i=Ot(t,xt);return r.createElement("svg",jt({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:e,"aria-labelledby":o},i),n?r.createElement("title",{id:o},n):null,ht||(ht=r.createElement("path",{d:"M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z"})))}var kt,It=r.forwardRef(Et),Ct=(n.p,["title","titleId"]);function Mt(){return(Mt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function Lt(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function St(t,e){var n=t.title,o=t.titleId,i=Lt(t,Ct);return r.createElement("svg",Mt({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:e,"aria-labelledby":o},i),n?r.createElement("title",{id:o},n):null,kt||(kt=r.createElement("path",{d:"M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z"})))}var Vt,At=r.forwardRef(St),Ht=(n.p,["title","titleId"]);function Pt(){return(Pt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function Rt(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function Dt(t,e){var n=t.title,o=t.titleId,i=Rt(t,Ht);return r.createElement("svg",Pt({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:e,"aria-labelledby":o},i),n?r.createElement("title",{id:o},n):null,Vt||(Vt=r.createElement("path",{d:"M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"})))}var Tt,Nt=r.forwardRef(Dt),Wt=(n.p,["title","titleId"]);function Bt(){return(Bt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function Xt(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function zt(t,e){var n=t.title,o=t.titleId,i=Xt(t,Wt);return r.createElement("svg",Bt({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:e,"aria-labelledby":o},i),n?r.createElement("title",{id:o},n):null,Tt||(Tt=r.createElement("path",{d:"M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z"})))}var Gt,Jt=r.forwardRef(zt),Zt=(n.p,["title","titleId"]);function Ft(){return(Ft=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function Yt(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function Ut(t,e){var n=t.title,o=t.titleId,i=Yt(t,Zt);return r.createElement("svg",Ft({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:e,"aria-labelledby":o},i),n?r.createElement("title",{id:o},n):null,Gt||(Gt=r.createElement("path",{d:"M4,4C3.45,4 3,4.45 3,5V10C2.54,10 2.14,10.31 2.03,10.76V13.97H2.29C2.65,13.37 3.3,13 4,13H13C13.7,13 14.35,13.37 14.71,13.97H16.03L16,11V11C16,10.45 15.55,10 15,10H13V8C13,7.45 12.55,7 12,7C11.45,7 11,7.45 11,8V10H9V5C9,4.45 8.55,4 8,4H4M5,6H7V10L7,11H5V6M17,11V19H22V18L19,17L18,11H17M4,15C2.9,15 2,15.9 2,17C2,18.1 2.9,19 4,19H13C14.1,19 15,18.1 15,17C15,15.9 14.1,15 13,15H4Z"})))}var qt=r.forwardRef(Ut),Qt=(n.p,n(26),function(){var t=T(),e=t.control,n=t.setValue,r=Object(c.b)({control:e,name:"settings.selectedTool"}),o=function(t){var e=t.type,o=t.name,i=t.icon;return Object(N.jsx)(ot,{title:o,onClick:function(){n("settings.selectedTool",e)},className:Object(rt.a)(r===e&&"toolboxSelectedItem"),children:null!==i&&void 0!==i?i:o})};return Object(N.jsxs)("div",{className:"toolboxContainer",children:[Object(N.jsx)(o,{type:"wall",name:"Wall",icon:Object(N.jsx)(Jt,{})}),Object(N.jsx)(o,{type:"destroy",name:"Destroy",icon:Object(N.jsx)(qt,{})}),Object(N.jsx)(o,{type:"cursor",name:"Cursor",icon:Object(N.jsx)(It,{})}),Object(N.jsx)(o,{type:"pencil",name:"Pencil",icon:Object(N.jsx)(Nt,{})}),Object(N.jsx)(o,{type:"eraser",name:"Eraser",icon:Object(N.jsx)(At,{})})]})}),_t=function(){var t=T(),e=t.commandsHistory,n=t.interactiveRef,o=t.drawing,i=t.control,l=t.setValue,a=Object(c.b)({control:i,name:"settings"}),u=a.stylusMode,s=a.magneticMode,d=a.wallAlignmentMode,f=a.selectedTool,p=Object(c.b)({control:i,name:"scale"}),v=Object(c.b)({control:i,name:"plan"});return Object(r.useEffect)((function(){if(n.current&&"wall"===f){return pt(n.current,(function(t){var e=t.x*p,n=t.y*p;if(!u||"touch"!==t.type)if("touch"===t.type&&t.touches.length>1)!function(t){var e=v.walls.findIndex((function(e){return e.editId===t}));if(e>=0){var n=v.walls.splice(e,1);o.removeElement(j(n[0]))}}(t.id);else{l("pointerDown",!0);var r=v.walls.length>0?Math.max.apply(null,v.walls.map((function(t){return parseInt(t.id)})))+1:1,i={id:"".concat(r),editId:t.id,p1:{x:e,y:n},p2:{x:e,y:n}};if(s){var c=v.walls.flatMap((function(t){return[t.p1,t.p2]})).find((function(t){return ut(t,i.p1)<=x}));c&&(i.p1.x=c.x,i.p1.y=c.y,i.p2.x=c.x,i.p2.y=c.y)}v.walls.push(i),E(o,i)}}),(function(t){if("mouse"!==t.type||t.buttons){var e=t.x*p,n=t.y*p,r=v.walls.find((function(e){return e.editId===t.id}));if(r){if(r.p2.x=e,r.p2.y=n,d){"horizontal"===at({p1:r.p1,p2:{x:e,y:n}})?r.p2.y=r.p1.y:r.p2.x=r.p1.x;var i=function(t,e){var n=at(e),r=[];return t.forEach((function(t){if(e!==t){var o=t.p1.x===t.p2.x?"vertical":t.p1.y===t.p2.y?"horizontal":"other";"horizontal"===n&&"horizontal"===o?Math.abs(e.p2.x-t.p1.x)<st?(e.p2.x=t.p1.x,r.push({wall:t,point:t.p1})):Math.abs(e.p2.x-t.p2.x)<st&&(e.p2.x=t.p2.x,r.push({wall:t,point:t.p2})):"vertical"===n&&"vertical"===o&&(Math.abs(e.p2.y-t.p1.y)<st?(e.p2.y=t.p1.y,r.push({wall:t,point:t.p1})):Math.abs(e.p2.y-t.p2.y)<st&&(e.p2.y=t.p2.y,r.push({wall:t,point:t.p2})))}})),r}(v.walls,r);I(o,r.p2,i)}k(o,r)}}}),(function(t){var n,r=v.walls.find((function(e){return e.editId===t.id}));if(r){if(s){var i=v.walls.filter((function(t){return t!==r})).flatMap((function(t){return[t.p1,t.p2]})).find((function(t){return ut(t,r.p2)<=x}));i&&(r.p2.x=i.x,r.p2.y=i.y)}C(o,r.p2),k(o,r),r.editId=void 0,e.add({tool:"wall",data:{addedWall:r}})}t.touches&&0!==(null===(n=t.touches)||void 0===n?void 0:n.length)||l("pointerDown",!1)}))}}),[p,u,s,d,e,n,f,v.walls,o,l]),null};var Kt=function(){var t=P(),e=t.interactiveRef,n=t.drawingRef;return Object(N.jsx)(D.Provider,{value:t,children:Object(N.jsxs)("main",{children:[Object(N.jsx)(lt,{}),Object(N.jsx)(_t,{}),Object(N.jsx)(bt,{}),Object(N.jsx)(mt,{}),Object(N.jsx)(gt,{}),Object(N.jsx)("div",{ref:e,className:"paper main",children:Object(N.jsxs)("svg",{ref:n,style:{width:"100%",height:"100%"},children:[Object(N.jsx)("g",{id:"pen"}),Object(N.jsx)("g",{id:"guide"}),Object(N.jsx)("g",{id:"walls"})]})}),Object(N.jsx)(Qt,{}),Object(N.jsxs)("div",{className:"rightMenu",children:[Object(N.jsx)(ct,{}),Object(N.jsx)(W,{}),Object(N.jsxs)("ol",{style:{paddingInlineStart:15,margin:0},children:[Object(N.jsx)("b",{children:"What need to do"}),Object(N.jsx)("li",{children:"hotkeys to undo"}),Object(N.jsx)("li",{children:"handle resize"}),Object(N.jsx)("li",{children:"pen color, width"}),Object(N.jsx)("li",{children:"wall length text"}),Object(N.jsx)("li",{children:"door, window"}),Object(N.jsx)("li",{children:"app icon"}),Object(N.jsx)("li",{children:"translate app"}),Object(N.jsx)("li",{children:"custom zoom"})]})]}),Object(N.jsx)(it,{})]})})},$t=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,28)).then((function(e){var n=e.getCLS,r=e.getFID,o=e.getFCP,i=e.getLCP,l=e.getTTFB;n(t),r(t),o(t),i(t),l(t)}))};l.a.render(Object(N.jsx)(Kt,{}),document.getElementById("root")),$t()}},[[27,1,2]]]);
//# sourceMappingURL=main.0d865c88.chunk.js.map