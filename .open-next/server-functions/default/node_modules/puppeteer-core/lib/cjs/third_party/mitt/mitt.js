/**
MIT License

Copyright (c) 2021 Jason Miller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
"use strict";var u=Object.defineProperty;var l=Object.getOwnPropertyDescriptor;var o=Object.getOwnPropertyNames;var _=Object.prototype.hasOwnProperty;var d=(e,t)=>()=>(e&&(t=e(e=0)),t);var s=(e,t)=>{for(var i in t)u(e,i,{get:t[i],enumerable:!0})},g=(e,t,i,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of o(t))!_.call(e,n)&&n!==i&&u(e,n,{get:()=>t[n],enumerable:!(r=l(t,n))||r.enumerable});return e};var c=e=>g(u({},"__esModule",{value:!0}),e);var f={};s(f,{default:()=>v});function v(e){return{all:e=e||new Map,on:function(t,i){var r=e.get(t);r?r.push(i):e.set(t,[i])},off:function(t,i){var r=e.get(t);r&&(i?r.splice(r.indexOf(i)>>>0,1):e.set(t,[]))},emit:function(t,i){var r=e.get(t);r&&r.slice().map(function(n){n(i)}),(r=e.get("*"))&&r.slice().map(function(n){n(t,i)})}}}var a=d(()=>{});var b=exports&&exports.__createBinding||(Object.create?function(e,t,i,r){r===void 0&&(r=i);var n=Object.getOwnPropertyDescriptor(t,i);(!n||("get"in n?!t.__esModule:n.writable||n.configurable))&&(n={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,r,n)}:function(e,t,i,r){r===void 0&&(r=i),e[r]=t[i]}),p=exports&&exports.__exportStar||function(e,t){for(var i in e)i!=="default"&&!Object.prototype.hasOwnProperty.call(t,i)&&b(t,e,i)},O=exports&&exports.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});exports.default=void 0;p((a(),c(f)),exports);var h=(a(),c(f));Object.defineProperty(exports,"default",{enumerable:!0,get:function(){return O(h).default}});
