import{W as _,S as L,P as N,B as M,a as S,b as W,c as H,L as I,d as T,e as j,M as q,f as D,g as O,G as U,V}from"./three.module.DkXd6Mmm.js";const y=document.getElementById("canvas-contacto");if(y){let A=function(){const t=l.attributes.position.array;let e=0;for(let a=0;a<o;a++)for(let s=a+1;s<o;s++)n[a].distanceTo(n[s])<x&&(t[e++]=n[a].x,t[e++]=n[a].y,t[e++]=n[a].z,t[e++]=n[s].x,t[e++]=n[s].y,t[e++]=n[s].z);for(;e<t.length;)t[e++]=0;l.attributes.position.needsUpdate=!0,l.setDrawRange(0,e/3)},C=function(){requestAnimationFrame(C);const t=(performance.now()-R)/1e3,e=p.array;for(let a=0;a<o;a++)e[a]=Math.max(0,Math.sin(t*P[a]+g[a]));p.needsUpdate=!0,d.rotation.y=t*.12,d.rotation.x=Math.sin(t*.07)*.18,c.render(i,h)};const r=y.parentElement,c=new _({canvas:y,antialias:!0,alpha:!0});c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.setClearColor(0,0),c.setSize(r.offsetWidth,r.offsetHeight);const i=new L,h=new N(55,r.offsetWidth/r.offsetHeight,.1,100);h.position.z=5.5;const o=90,v=2.2,x=1.4,n=[],g=new Float32Array(o),P=new Float32Array(o),z=Math.PI*(3-Math.sqrt(5));for(let t=0;t<o;t++){const e=1-t/(o-1)*2,a=Math.sqrt(1-e*e),s=z*t;n.push(new V(Math.cos(s)*a*v,e*v,Math.sin(s)*a*v)),g[t]=Math.random()*Math.PI*2,P[t]=.4+Math.random()*.9}const p=new M(new Float32Array(o),1),w=new S,f=new Float32Array(o*3);n.forEach((t,e)=>{f[e*3]=t.x,f[e*3+1]=t.y,f[e*3+2]=t.z}),w.setAttribute("position",new M(f,3)),w.setAttribute("flash",p);const F=new W({transparent:!0,uniforms:{pointSize:{value:5*Math.min(window.devicePixelRatio,2)}},vertexShader:`
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
        `}),m=new H(w,F);i.add(m);const b=new I({color:8141549,transparent:!0,opacity:.1}),l=new S,B=new Float32Array(o*o*6);l.setAttribute("position",new M(B,3));const u=new T(l,b);i.add(u);const E=new j(1,32,32),G=new q({color:8141549,transparent:!0,opacity:.03,side:D});i.add(new O(E,G));const d=new U;d.add(m),d.add(u),i.add(d),i.remove(m),i.remove(u),A();const R=performance.now();C(),window.addEventListener("resize",()=>{const t=r.offsetWidth,e=r.offsetHeight;c.setSize(t,e),h.aspect=t/e,h.updateProjectionMatrix()})}
