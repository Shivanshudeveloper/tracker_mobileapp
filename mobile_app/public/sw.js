if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let n={};const r=e=>c(e,i),u={module:{uri:i},exports:n,require:r};s[i]=Promise.all(a.map((e=>u[e]||r(e)))).then((e=>(t(...e),n)))}}define(["./workbox-22294e6b"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/server/middleware-manifest.json",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/0PFUwS4cYcGBfcs5XyIur/_buildManifest.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/0PFUwS4cYcGBfcs5XyIur/_middlewareManifest.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/0PFUwS4cYcGBfcs5XyIur/_ssgManifest.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/202-4c8589e38e4a4877.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/22-1f783c0c8e6fd618.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/273-a68ee97ceffdfb76.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/275-cb4fa169f03396ad.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/289-ffcc62e0cf3f7022.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/32-b51d3ee9fdefc43d.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/36bcf0ca-f48a13ba32e9b52e.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/43-f7d743f348538f31.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/435-bfa07143ee3aec6d.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/473-a38df7c0ff78d231.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/630-ef97252c189eacbc.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/643-5b7e82f8e9b4f060.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/675-a9689c6d65ebf9d7.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/70-8fd9da4950d01389.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/7112840a-5fa6171865511cec.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/faee2839-2fe3b760f30575b0.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/framework-dc33c0b5493501f0.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/main-a8d8c707a7d4af7f.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/404-c799dac5b90d6d32.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/_app-76b448e8182ee4aa.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/_error-a3f18418a2205cb8.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/account-685ffc5bcfd2b257.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/customers-29eed12852b8e6bb.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/index-37f52219bf020c31.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/login-5d07b9289d588176.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/products-b80dd29e44accd7f.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/register-ab416b5011673974.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/pages/settings-ad3ff7620222b037.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/_next/static/chunks/webpack-378e68e29c265886.js",revision:"0PFUwS4cYcGBfcs5XyIur"},{url:"/favicon.ico",revision:"4c34cf74ffd5c9d0f5edc3abc96d8ce0"},{url:"/index.html",revision:"0c07af21750662e51cb6fd7f52ee730c"},{url:"/manifest.json",revision:"6ba3ee8f19cab694c029cffe5f47204e"},{url:"/static/images/auth.jpeg",revision:"7d032289c543f5a3101b158ae3878f44"},{url:"/static/images/avatars/avatar_1.png",revision:"0ba959fd3605c7a8cc38eddb21278b8e"},{url:"/static/images/avatars/avatar_10.png",revision:"f7e7fc9ad4f2fcf6bb728967e9de6e39"},{url:"/static/images/avatars/avatar_11.png",revision:"031d7521994313e24e8c9f28db1fd59a"},{url:"/static/images/avatars/avatar_2.png",revision:"55f7378423ca75e44f1b2a5ffb340a33"},{url:"/static/images/avatars/avatar_3.png",revision:"504f7b4f1ab3a3b447d0e4ded9aaa835"},{url:"/static/images/avatars/avatar_4.png",revision:"03120898caa854650d1fdfa48c3b94ff"},{url:"/static/images/avatars/avatar_5.png",revision:"864765d7b4afce2911a4dc8f4eb0ddd9"},{url:"/static/images/avatars/avatar_6.png",revision:"0db4eac2a38f37fd66f0310fb78a32fb"},{url:"/static/images/avatars/avatar_7.png",revision:"7b4b2e8666624cc3105267db6b211046"},{url:"/static/images/avatars/avatar_8.png",revision:"bf9dc2bdbcccb072160cf28e6d886401"},{url:"/static/images/avatars/avatar_9.png",revision:"afd9e37a1e3d3248ebd97786b3ffc329"},{url:"/static/images/not_found.png",revision:"19302660994a495f202e28060bec52af"},{url:"/static/images/products/product_1.png",revision:"9ffe5bb336f9810f4fbf2f6539681ba5"},{url:"/static/images/products/product_2.png",revision:"a85604f386082355e33b3668bbb9624f"},{url:"/static/images/products/product_3.png",revision:"7702abc16e3103116868499d1cb71608"},{url:"/static/images/products/product_4.png",revision:"30cbac1a6127be3802dc08f05719c08f"},{url:"/static/images/products/product_5.png",revision:"f7e5892d006ad609c88137d60aa9a5cb"},{url:"/static/images/products/product_6.png",revision:"feeaf55c5dbecf53c9fd707b35b95a4e"},{url:"/static/images/sidebar_pro.png",revision:"a61220eebeb72991a76d13fadbd527d0"},{url:"/static/images/undraw_page_not_found_su7k.svg",revision:"6695af9986412e75985538255ca87866"},{url:"/static/images/undraw_resume_folder_2_arse.svg",revision:"fd77e55e562daef2619ebf7e299665fa"},{url:"/static/logo.svg",revision:"27654955f82044d361ddcbe8d168cdaf"},{url:"/static/thumbnail.png",revision:"ecc4acc3919eae77d450c0f78afad457"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
