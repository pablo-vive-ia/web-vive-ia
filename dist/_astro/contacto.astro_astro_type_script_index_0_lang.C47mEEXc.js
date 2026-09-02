import{W as N,S as q,P as W,B as P,a as b,b as H,c as O,L as T,d as V,e as j,M as D,f as U,g as k,G as J,V as K}from"./three.module.DkXd6Mmm.js";const m=document.getElementById("canvas-contacto");if(m){let x=function(){const e=d.attributes.position.array;let t=0;for(let o=0;o<n;o++)for(let s=o+1;s<n;s++)a[o].distanceTo(a[s])<F&&(e[t++]=a[o].x,e[t++]=a[o].y,e[t++]=a[o].z,e[t++]=a[s].x,e[t++]=a[s].y,e[t++]=a[s].z);for(;t<e.length;)e[t++]=0;d.attributes.position.needsUpdate=!0,d.setDrawRange(0,t/3)},p=function(){if(!g){f=null;return}f=requestAnimationFrame(p);const e=(performance.now()-_)/1e3,t=w.array;for(let o=0;o<n;o++)t[o]=Math.max(0,Math.sin(e*S[o]+A[o]));w.needsUpdate=!0,h.rotation.y=e*.12,h.rotation.x=Math.sin(e*.07)*.18,c.render(r,l)};const i=m.parentElement,c=new N({canvas:m,antialias:!0,alpha:!0});c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.setClearColor(0,0),c.setSize(i.offsetWidth,i.offsetHeight);const r=new q,l=new W(55,i.offsetWidth/i.offsetHeight,.1,100);l.position.z=5.5;const n=90,u=2.2,F=1.4,a=[],A=new Float32Array(n),S=new Float32Array(n),z=Math.PI*(3-Math.sqrt(5));for(let e=0;e<n;e++){const t=1-e/(n-1)*2,o=Math.sqrt(1-t*t),s=z*e;a.push(new K(Math.cos(s)*o*u,t*u,Math.sin(s)*o*u)),A[e]=Math.random()*Math.PI*2,S[e]=.4+Math.random()*.9}const w=new P(new Float32Array(n),1),C=new b,v=new Float32Array(n*3);a.forEach((e,t)=>{v[t*3]=e.x,v[t*3+1]=e.y,v[t*3+2]=e.z}),C.setAttribute("position",new P(v,3)),C.setAttribute("flash",w);const B=new H({transparent:!0,uniforms:{pointSize:{value:5*Math.min(window.devicePixelRatio,2)}},vertexShader:`
          attribute float flash;
          varying float vFlash;
          varying vec3 vPos;
          uniform float pointSize;
          void main() {
            vFlash = flash;
            vPos = position;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = pointSize * (1.0 + 0.5 * flash);
            gl_Position = projectionMatrix * mv;
          }
        `,fragmentShader:`
          varying float vFlash;
          varying vec3 vPos;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float yN = (vPos.y + 2.2) / 4.4;
            vec3 cA = vec3(0.486, 0.227, 0.929); // violet
            vec3 cB = vec3(0.024, 0.714, 0.831); // cyan
            vec3 col = mix(cA, cB, clamp(yN, 0.0, 1.0));
            float alpha = (0.4 + 0.45 * vFlash) * (1.0 - smoothstep(0.3, 0.5, d));
            gl_FragColor = vec4(col, alpha);
          }
        `}),M=new O(C,B);r.add(M);const E=new T({color:8141549,transparent:!0,opacity:.1}),d=new b,G=new Float32Array(n*n*6);d.setAttribute("position",new P(G,3));const y=new V(d,E);r.add(y);const I=new j(1,32,32),R=new D({color:8141549,transparent:!0,opacity:.03,side:U});r.add(new k(I,R));const h=new J;h.add(M),h.add(y),r.add(h),r.remove(M),r.remove(y),x();const _=performance.now(),L=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let g=!0,f=null;L?c.render(r,l):(new IntersectionObserver(t=>{g=t[0]?.isIntersecting??!0,g&&f===null&&(f=requestAnimationFrame(p))},{threshold:0}).observe(m),f=requestAnimationFrame(p)),window.addEventListener("resize",()=>{const e=i.offsetWidth,t=i.offsetHeight;c.setSize(e,t),l.aspect=e/t,l.updateProjectionMatrix()})}
