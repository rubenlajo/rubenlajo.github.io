(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{1317:function(e,t,n){},1318:function(e,t,n){},1319:function(e,t,n){"use strict";var a=n(0),r=n.n(a),i=n(59),o=n(5),c=n(52),l=n(387),s=n(66),u=n.n(s),f=n(67),m=n.n(f),d=n(34),b=n(94),g=n(14),h=function(e){var t=Object(d.a)((function(e){return{userNames:b.i(e),userNamesLoading:b.j(e)}}),(function(e){return{fetchUserNames:function(t){return e(g.g(t))}}}))(e);return m()(u()(e,"withUserNames"))(t)},p=n(1311),v=n(1309),E=(n(1317),n(389));var y=function(e){var t=e.name,n=e.login,a=e.progress,i=e.selected,o=e.onSelect;return r.a.createElement("div",{className:"assign-user-list-item",onClick:function(){return o()}},r.a.createElement(E.a,{className:"assign-user-avatar",users:[{login:n,name:t}]}),r.a.createElement("div",{className:"assign-user-list-content"},r.a.createElement("div",{className:"assign-user-name"},t),r.a.createElement("div",{className:"assign-user-progress"},r.a.createElement(c.g,{label:a,color:"var(--color-neutral100, #B5B5B5)",backgroundColor:"var(--color-neutral600, #363636)",info:!0}))),r.a.createElement(c.n,{label:"",value:i}))},k=n(20);n(1318);function M(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,i,o,c=[],l=!0,s=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;l=!1}else for(;!(l=(a=i.call(n)).done)&&(c.push(a.value),c.length!==t);l=!0);}catch(e){s=!0,r=e}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(s)throw r}}return c}}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return j(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return j(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}t.a=Object(l.a)(Object(p.a)(h((function(e){var t=e.visible,n=e.close,l=e.onSelect,s=e.centerSelected,u=e.fetchWarehouseMovementTechnicians,f=e.technicians,m=e.clearWarhouseMovementTechnicians,d=e.fetchUserNames,b=e.userNames,g=M(Object(a.useState)(""),2),h=g[0],p=g[1],E=M(Object(a.useState)(!1),2),j=E[0],C=E[1];Object(a.useEffect)((function(){s&&!f.requestDone&&!f.fetching&&t&&u(s.centerId)}),[s,f,t]);var w=Object(i.c)((function(e){return e.application.userNamesLoading}));return Object(a.useEffect)((function(){var e;if((null==f||null===(e=f.list)||void 0===e?void 0:e.length)>0){var t,n=[];null===(t=f.list)||void 0===t||t.forEach((function(e){e.technnician&&e.technnician.technnicianLogin&&n.push(e.technnician.technnicianLogin)})),(null==n?void 0:n.length)>0&&!w&&d(n)}}),[f]),r.a.createElement(v.a,{className:"assign-pannel",title:o.b.formatMessage({id:"stock.routes.pda.assign-warehouse-movement"}),visible:t,onClose:function(){n(),m()},searchText:h,onSearch:function(e){return p(e)}},t&&r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"technicians-list"},f.list.filter((function(e){return!h||(e.technnician.technnicianName.toLowerCase().includes(h.toLowerCase())||e.technnician.technnicianLogin.toLowerCase().includes(h.toLowerCase()))})).map((function(e){var t=e.technnician,n=e.assignmentsTotalNum,a=e.assignmentsMaxNum;return r.a.createElement(y,{key:t.technnicianLogin,login:t.technnicianLogin,name:Object(k.k)(b,t.technnicianLogin)||"A A",progress:"".concat(n,"/").concat(a," ").concat(o.b.formatMessage({id:"stock.pda.work-order-detail.assign.executed-orders"})),selected:j&&j.technnicianLogin===t.technnicianLogin,onSelect:function(){return C(t)}})}))),0===f.list.length&&f.requestDone?r.a.createElement("div",{className:"no-technicians-found-msg"},r.a.createElement(o.a,{id:"stock.pda.work-order.assign.no-technicians-msg"})):null,r.a.createElement(c.d,{kind:"primary",disabled:!j,className:"technician-assign-btn",onClick:function(){l(j.technnicianLogin)},label:"Asignar"})))}))))},1324:function(e,t,n){"use strict";var a=n(0),r=n.n(a),i=n(5),o=n(1320),c=n(52),l=n(1309);t.a=function(e){var t=e.visible,n=e.onClose,a=e.onExecute,s=e.onAssign;return r.a.createElement(l.a,{title:i.b.formatMessage({id:"stock.pda.transfer-material.transfer-panel.title"}),visible:t,onClose:n,showArrowClose:!1,className:"mobile-slide-pannel_transfer-material"},r.a.createElement(o.b,null,r.a.createElement(o.a,{className:"align-center"},r.a.createElement(i.a,{id:"stock.pda.transfer-material.transfer-panel.execute"}))),r.a.createElement(o.b,null,r.a.createElement(o.a,null,r.a.createElement(c.d,{kind:"primary",icon:"",className:"btn align-center",disabled:!a,onClick:function(){return a?a():null},label:i.b.formatMessage({id:"stock.pda.transfer-material.transfer-panel.yes-execute"})}),r.a.createElement(c.d,{kind:"secondary",icon:"",className:"btn align-center",onClick:function(){return s?s():null},label:i.b.formatMessage({id:"stock.pda.transfer-material.transfer-panel.no-assign"})}),r.a.createElement(c.d,{kind:"tertiary",className:"btn align-center",onClick:function(){return n()},label:i.b.formatMessage({id:"stock.pda.transfer-material.transfer-panel.cancel"})}))))}},1343:function(e,t,n){},1358:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(5),o=n(162),c=n(1315),l=n(52),s=n(1316),u=n(387),f=n(1327),m=n(1311),d=n(1319),b=n(1324),g=n(1320),h=n(1309);function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,i,o,c=[],l=!0,s=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;l=!1}else for(;!(l=(a=i.call(n)).done)&&(c.push(a.value),c.length!==t);l=!0);}catch(e){s=!0,r=e}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(s)throw r}}return c}}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return v(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return v(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}var E=function(e){var t=e.visible,n=e.onClose,o=e.locationEditing,c=e.onChangeUnitsConfirm,s=e.onRemoveLocation,u=e.disableRemove,f=p(Object(a.useState)(o.unitsToTraspase),2),m=f[0],d=f[1],b=o.stock>=m&&m>0;return r.a.createElement(h.a,{title:i.b.formatMessage({id:"stock.pda.transfer-material.transfer-units-modify"}),visible:t,onClose:n,showArrowClose:!1},r.a.createElement(g.b,null,r.a.createElement(g.a,null,r.a.createElement(l.h,{title:i.b.formatMessage({id:"stock.pda.transfer-material.location"}),subtitle:o.locationCode})),r.a.createElement(g.a,null,r.a.createElement(l.h,{title:i.b.formatMessage({id:"stock.pda.transfer-material.total-units"}),subtitle:o.stock}))),r.a.createElement(g.b,null,r.a.createElement(g.a,null,r.a.createElement(l.m,{label:i.b.formatMessage({id:"stock.pda.transfer-material.units-to-transfer"}),value:m,onChange:function(e){return d(e)},errors:b?[]:["Cantidad no válida"]}))),r.a.createElement(g.b,null,r.a.createElement(g.a,null,r.a.createElement(l.d,{kind:"primary",icon:"",className:"btn align-center",disabled:!b,onClick:function(){return c(m)},label:i.b.formatMessage({id:"stock.pda.transfer-material.modify-units"})}),r.a.createElement(l.d,{kind:"secondary",icon:"",className:"btn align-center",disabled:u,onClick:s,label:i.b.formatMessage({id:"stock.pda.transfer-material.remove-location"})}),r.a.createElement(l.d,{kind:"tertiary",className:"btn align-center",onClick:n,label:i.b.formatMessage({id:"stock.pda.transfer-material.cancel"})}))))};n(1343);function y(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,i,o,c=[],l=!0,s=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;l=!1}else for(;!(l=(a=i.call(n)).done)&&(c.push(a.value),c.length!==t);l=!0);}catch(e){s=!0,r=e}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(s)throw r}}return c}}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return k(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return k(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function k(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}t.default=Object(c.b)(Object(u.a)(Object(f.a)(Object(m.a)((function(e){var t=e.fetchCenters,n=e.centers,c=e.match,u=e.centerSelected,f=e.material,m=e.fetchMaterialById,g=e.fetchMaterialLocations,h=e.createWhMTransferRefSetUnits,p=e.locationEditing,v=e.setLocationEditing,k=e.createWhMTransferRefConfirmUnits,M=e.createWhMTransferRemoveLocation,j=e.createWhMTransferReference,C=e.warehouseMovementsCreated,w=e.assignWarehouseMovement,O=e.addNotification,N=e.user,I=e.redirectToExec,S=e.clearCreatedWarehouseMovement,A=y(Object(a.useState)(!1),2),T=A[0],L=A[1],x=y(Object(a.useState)(!1),2),U=x[0],R=x[1],W=y(Object(a.useState)(!1),2),B=W[0],F=W[1];if(Object(a.useEffect)((function(){0===n.length&&t()}),[]),Object(a.useEffect)((function(){u&&m(u.centerId,c.params.materialId)}),[u]),Object(a.useEffect)((function(){f&&f.hasMore&&!f.locationsFetching&&g(u.centerId,f.materialId,{offset:0,limit:100})}),[f]),Object(a.useEffect)((function(){f&&f.locations.length>0&&f.hasMore&&!f.locationsFetching&&g(u.centerId,f.materialId,{offset:f.filters.offset+f.filters.limit,limit:f.filters.limit})}),[f]),Object(a.useEffect)((function(){null!==C&&R(!0)}),[C]),Object(a.useEffect)((function(){if(I&&null!==C){var e=C[0];o.b.push("/stock/pda/warehouse-movements-exec-traspase/".concat(e.warehouseMovementId))}}),[I]),!f)return null;var $=function(){return o.b.push("/stock/pda/materials/".concat(c.params.materialId))},q=function(){var e=C[0];w(u.centerId,e.warehouseMovementId,N.login,i.b.formatMessage({id:"stock.routes.pda.transfer"}),!0)},z=function(e){C&&1===C.length&&w(u.centerId,C[0].warehouseMovementId,e,i.b.formatMessage({id:"stock.routes.pda.transfer"})),F(!1),R(!1),$()};return r.a.createElement(s.a,{className:"transfer-material-page-mobile",breadcrumb:i.b.formatMessage({id:"stock.pda.transfer-material.page.title"}),onBack:function(){return $()},contentScroll:!1,resourceName:"warehouseMovmementExecTransferPage"},r.a.createElement(l.h,{title:i.b.formatMessage({id:"stock.pda.reference-detail.reference"}),subtitle:f.general.manufacturerReference}),r.a.createElement("div",{className:"locations-list"},0===f.locations.length?r.a.createElement("div",{className:"flex halign-center valign-center h100"},r.a.createElement(i.a,{id:"stock.pda.transfer-material.no-locations"})):f.locations.map((function(e){return r.a.createElement(l.o,{key:e.locationId,title:e?e.locationCode:"-",subtitle:i.b.formatMessage({id:"stock.pda.transfer-material.units-to-transfer-in"}),number:e.unitsToTraspase||"00",icon:"sga-icon-pen-alt",onActionClicked:function(){v(e),setTimeout((function(){return L(!0)}),50)},disabledIcon:!e.stock||0===e.stock})}))),r.a.createElement(l.d,{kind:"primary",size:"size-s",onClick:function(){return j(u.centerId,f.materialId,f.locations)},disabled:0===f.locations.length,label:i.b.formatMessage({id:"stock.pda.transfer-material.page.title"})}),p?r.a.createElement(E,{visible:T,onClose:function(){L(!1),setTimeout((function(){return v(null)}),50)},locationEditing:p,onChangeUnitsConfirm:function(e){L(!1),h(e),setTimeout((function(){k(e)}),50)},onRemoveLocation:function(){L(!1),setTimeout((function(){return M(p.locationId)}),50)},disableRemove:f.locations.length<2}):null,r.a.createElement(b.a,{visible:U,onClose:function(){var e=C[0];R(!1),C&&1===C.length&&(O({type:"success",fadeout:!0,content:i.b.formatMessage({id:"stock.reactions.pda.transfer-material.created"}).replace("XwarehouseMovementIdX",e.warehouseMovementId)}),S(),$())},onExecute:q,onAssign:function(){R(!1),F(!0)}}),r.a.createElement(d.a,{visible:B,close:function(){return F(!1)},onSelect:z}))})))))}}]);