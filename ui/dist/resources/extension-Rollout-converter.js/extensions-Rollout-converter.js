(()=>{"use strict";var e={d:(n,t)=>{for(var o in t)e.o(t,o)&&!e.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:t[o]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>r});const t=window.React;const o=({resource:e})=>{const[n,o]=t.useState(null);return t.useEffect((()=>{var n;const t=(null==(n=e.metadata)?void 0:n.labels)||{},r=t["argocd.argoproj.io/instance"]||t["app.kubernetes.io/instance"];if(!r)return void console.warn("Application name not found in labels");var a,l,i;a=void 0,l=null,i=function*(){var e;try{const n=yield fetch(`/api/v1/applications/${r}/manifests`,{credentials:"include"});if(!n.ok)throw new Error("Failed to fetch manifests");const t=yield n.json(),a=null!=(e=null==t?void 0:t.manifests)?e:[];o(a||null)}catch(e){console.error("Error fetching desired manifest:",e),o(null)}},new Promise(((e,n)=>{var t=e=>{try{r(i.next(e))}catch(e){n(e)}},o=e=>{try{r(i.throw(e))}catch(e){n(e)}},r=n=>n.done?e(n.value):Promise.resolve(n.value).then(t,o);r((i=i.apply(a,l)).next())}))}),[e]),t.createElement("div",null,t.createElement("h3",null,"Desired Deployment Manifest"),n?t.createElement("pre",{style:{background:"#f4f4f4",padding:"1rem",borderRadius:"8px",overflowX:"auto",fontSize:"12px"}},machedManifest):t.createElement("p",null,"Matching manifest not found."))},r=o;var a,l;a=window,null==(l=null==a?void 0:a.extensionsAPI)||l.registerResourceExtension(o,"apps","Deployment","Annotations YAML"),(window.tmp=window.tmp||{}).extensions=n})();