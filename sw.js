if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const l=e=>i(e,t),c={module:{uri:t},exports:o,require:l};s[t]=Promise.all(n.map((e=>c[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/browser-CjxjEH3P.js",revision:null},{url:"assets/index-aQNtUnax.js",revision:null},{url:"assets/index-kQJbKSsj.css",revision:null},{url:"index.html",revision:"f82e5ef8e665a9ff174a3a92c1c4c6de"},{url:"registerSW.js",revision:"4e5448c6f5e5075a32ebb41cc2624960"},{url:"manifest.webmanifest",revision:"bc1add49929609ca8745940b986ceb32"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
