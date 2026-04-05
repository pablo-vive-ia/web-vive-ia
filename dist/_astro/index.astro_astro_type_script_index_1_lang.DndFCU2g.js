import{W as L,S as _,P as B,V as C,B as u,a as x,b as R,c as T,L as W,d as G,C as U}from"./three.module.DkXd6Mmm.js";const v=document.getElementById("canvas-no-caos");if(v){let A=function(){const e=d.attributes.position.array;let a=0;for(let s=0;s<n;s++)for(let t=s+1;t<n;t++)o[s].distanceTo(o[t])<N&&(e[a++]=o[s].x,e[a++]=o[s].y,e[a++]=o[s].z,e[a++]=o[t].x,e[a++]=o[t].y,e[a++]=o[t].z);for(;a<e.length;)e[a++]=0;d.attributes.position.needsUpdate=!0,d.setDrawRange(0,a/3)},M=function(){requestAnimationFrame(M);const e=E.getElapsedTime(),a=m.array;for(let t=0;t<n;t++)a[t]=Math.max(0,Math.sin(e*g[t]+y[t]));m.needsUpdate=!0;for(let t=0;t<n;t++)o[t].add(c[t]),Math.abs(o[t].x)>5&&(c[t].x*=-1),Math.abs(o[t].y)>3&&(c[t].y*=-1),Math.abs(o[t].z)>2&&(c[t].z*=-1);const s=l.attributes.position.array;o.forEach((t,w)=>{s[w*3]=t.x,s[w*3+1]=t.y,s[w*3+2]=t.z}),l.attributes.position.needsUpdate=!0,A(),h.rotation.y+=.002,r.render(h,f)};const r=new L({canvas:v,antialias:!0,alpha:!0});r.setPixelRatio(Math.min(window.devicePixelRatio,2)),r.setClearColor(0,0);const i=v.parentElement;r.setSize(i.offsetWidth,i.offsetHeight);const h=new _,f=new B(60,i.offsetWidth/i.offsetHeight,.1,100);f.position.z=6;const n=50,o=[],c=[],y=new Float32Array(n),g=new Float32Array(n);for(let e=0;e<n;e++)y[e]=Math.random()*Math.PI*2,g[e]=.6+Math.random()*1.4,o.push(new C((Math.random()-.5)*10,(Math.random()-.5)*6,(Math.random()-.5)*4)),c.push(new C((Math.random()-.5)*.004,(Math.random()-.5)*.004,(Math.random()-.5)*.004));const m=new u(new Float32Array(n),1),l=new x,p=new Float32Array(n*3);o.forEach((e,a)=>{p[a*3]=e.x,p[a*3+1]=e.y,p[a*3+2]=e.z}),l.setAttribute("position",new u(p,3)),l.setAttribute("flash",m);const b=new R({transparent:!0,uniforms:{pointSize:{value:6*window.devicePixelRatio}},vertexShader:`
          attribute float flash;
          varying float vFlash;
          uniform float pointSize;
          void main() {
            vFlash = flash;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = pointSize * (1.0 + 0.6 * flash);
            gl_Position = projectionMatrix * mv;
          }
        `,fragmentShader:`
          varying float vFlash;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = (0.55 + 0.4 * vFlash) * (1.0 - smoothstep(0.3, 0.5, d));
            gl_FragColor = vec4(0.486, 0.227, 0.929, alpha);
          }
        `}),z=new T(l,b);h.add(z);const S=new W({color:8141549,transparent:!0,opacity:.22}),d=new x,P=new Float32Array(n*n*6);d.setAttribute("position",new u(P,3));const F=new G(d,S);h.add(F);const N=2,E=new U;M(),window.addEventListener("resize",()=>{const e=i.offsetWidth,a=i.offsetHeight;r.setSize(e,a),f.aspect=e/a,f.updateProjectionMatrix()})}
