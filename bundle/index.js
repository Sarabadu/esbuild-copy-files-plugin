import o from"fs";import s from"path";function S(i){return!!s.extname(i)}function f(i){try{o.accessSync(i)}catch{o.mkdirSync(i,{recursive:!0})}}function m(i,n){if(S(n)){let e=s.dirname(n);f(e),o.copyFileSync(i,n)}else f(n),o.copyFileSync(i,s.join(n,s.basename(i)))}function y(i,n,e){if(e){let c=s.join(n,s.basename(i));return f(c),y(i,c)}if(f(n),o.lstatSync(i).isDirectory()){let c=o.readdirSync(i);for(let t of c){let r=s.join(i,t);o.lstatSync(r).isDirectory()?y(r,s.join(n,t)):m(r,n)}}}function l({source:i,target:n,copyWithFolder:e}){if(Array.isArray(n))for(let c of n)l({source:i,target:c,copyWithFolder:e});else if(Array.isArray(i)&&!Array.isArray(n))for(let c of i)l({source:c,target:n,copyWithFolder:e});else o.existsSync(i)&&(o.lstatSync(i).isFile()?m(i,n):o.lstatSync(i).isDirectory()&&y(i,n,e))}function a({source:i,target:n,copyWithFolder:e}){console.log("Copying files..."),o.existsSync(n)&&o.rmSync(n,{recursive:!0}),l({source:i,target:n,copyWithFolder:e}),console.log("Files copied.")}var p=a;var D=({source:i,target:n,copyWithFolder:e})=>({name:"copy",setup(c){c.onEnd(()=>p({source:i,target:n,copyWithFolder:e}))}});export{D as default};
//# sourceMappingURL=index.js.map
