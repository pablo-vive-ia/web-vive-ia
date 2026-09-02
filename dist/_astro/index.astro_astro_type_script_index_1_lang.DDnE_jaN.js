import{W as B,S as R,P as T,V as A,B as y,a as x,b as W,c as G,L as O,d as U,C as V}from"./three.module.DkXd6Mmm.js";const p=document.getElementById("canvas-no-caos");if(p){let N=function(){const t=h.attributes.position.array;let a=0;for(let s=0;s<o;s++)for(let e=s+1;e<o;e++)n[s].distanceTo(n[e])<I&&(t[a++]=n[s].x,t[a++]=n[s].y,t[a++]=n[s].z,t[a++]=n[e].x,t[a++]=n[e].y,t[a++]=n[e].z);for(;a<t.length;)t[a++]=0;h.attributes.position.needsUpdate=!0,h.setDrawRange(0,a/3)},w=function(){if(!M){u=null;return}u=requestAnimationFrame(w);const t=L.getElapsedTime(),a=v.array;for(let e=0;e<o;e++)a[e]=Math.max(0,Math.sin(t*g[e]+b[e]));v.needsUpdate=!0;for(let e=0;e<o;e++)n[e].add(d[e]),Math.abs(n[e].x)>5&&(d[e].x*=-1),Math.abs(n[e].y)>3&&(d[e].y*=-1),Math.abs(n[e].z)>2&&(d[e].z*=-1);const s=f.attributes.position.array;n.forEach((e,C)=>{s[C*3]=e.x,s[C*3+1]=e.y,s[C*3+2]=e.z}),f.attributes.position.needsUpdate=!0,N(),l.rotation.y+=.002,r.render(l,c)};const r=new B({canvas:p,antialias:!0,alpha:!0});r.setPixelRatio(Math.min(window.devicePixelRatio,2)),r.setClearColor(0,0);const i=p.parentElement;r.setSize(i.offsetWidth,i.offsetHeight);const l=new R,c=new T(60,i.offsetWidth/i.offsetHeight,.1,100);c.position.z=6;const o=50,n=[],d=[],b=new Float32Array(o),g=new Float32Array(o);for(let t=0;t<o;t++)b[t]=Math.random()*Math.PI*2,g[t]=.6+Math.random()*1.4,n.push(new A((Math.random()-.5)*10,(Math.random()-.5)*6,(Math.random()-.5)*4)),d.push(new A((Math.random()-.5)*.004,(Math.random()-.5)*.004,(Math.random()-.5)*.004));const v=new y(new Float32Array(o),1),f=new x,m=new Float32Array(o*3);n.forEach((t,a)=>{m[a*3]=t.x,m[a*3+1]=t.y,m[a*3+2]=t.z}),f.setAttribute("position",new y(m,3)),f.setAttribute("flash",v);const z=new W({transparent:!0,uniforms:{pointSize:{value:6*window.devicePixelRatio}},vertexShader:`
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
        `}),S=new G(f,z);l.add(S);const F=new O({color:8141549,transparent:!0,opacity:.22}),h=new x,P=new Float32Array(o*o*6);h.setAttribute("position",new y(P,3));const E=new U(h,F);l.add(E);const I=2,L=new V,_=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let M=!0,u=null;_?r.render(l,c):(new IntersectionObserver(a=>{M=a[0]?.isIntersecting??!0,M&&u===null&&(u=requestAnimationFrame(w))},{threshold:0}).observe(p),u=requestAnimationFrame(w)),window.addEventListener("resize",()=>{const t=i.offsetWidth,a=i.offsetHeight;r.setSize(t,a),c.aspect=t/a,c.updateProjectionMatrix()})}
