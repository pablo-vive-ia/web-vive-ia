import{t as e}from"./preload-helper.DygEbaNj.js";var t=document.getElementById(`canvas-contacto`);if(t){let n=async()=>{let n=await e(()=>import(`./three.BmtxskG-.js`),[]),r=t.parentElement,i=new n.WebGLRenderer({canvas:t,antialias:!0,alpha:!0});i.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.setClearColor(0,0),i.setSize(r.offsetWidth,r.offsetHeight);let a=new n.Scene,o=new n.PerspectiveCamera(55,r.offsetWidth/r.offsetHeight,.1,100);o.position.z=5.5;let s=2.2,c=[],l=new Float32Array(90),u=new Float32Array(90),d=Math.PI*(3-Math.sqrt(5));for(let e=0;e<90;e++){let t=1-e/89*2,r=Math.sqrt(1-t*t),i=d*e;c.push(new n.Vector3(Math.cos(i)*r*s,t*s,Math.sin(i)*r*s)),l[e]=Math.random()*Math.PI*2,u[e]=.4+Math.random()*.9}let f=new n.BufferAttribute(new Float32Array(90),1),p=new n.BufferGeometry,m=new Float32Array(270);c.forEach((e,t)=>{m[t*3]=e.x,m[t*3+1]=e.y,m[t*3+2]=e.z}),p.setAttribute(`position`,new n.BufferAttribute(m,3)),p.setAttribute(`flash`,f);let h=new n.ShaderMaterial({transparent:!0,uniforms:{pointSize:{value:5*Math.min(window.devicePixelRatio,2)}},vertexShader:`
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
        `}),g=new n.Points(p,h);a.add(g);let _=new n.LineBasicMaterial({color:8141549,transparent:!0,opacity:.1}),v=new n.BufferGeometry,y=new Float32Array(48600);v.setAttribute(`position`,new n.BufferAttribute(y,3));let b=new n.LineSegments(v,_);a.add(b);let x=new n.SphereGeometry(1,32,32),S=new n.MeshBasicMaterial({color:8141549,transparent:!0,opacity:.03,side:n.BackSide});a.add(new n.Mesh(x,S));let C=new n.Group;C.add(g),C.add(b),a.add(C),a.remove(g),a.remove(b);function w(){let e=v.attributes.position.array,t=0;for(let n=0;n<90;n++)for(let r=n+1;r<90;r++)c[n].distanceTo(c[r])<1.4&&(e[t++]=c[n].x,e[t++]=c[n].y,e[t++]=c[n].z,e[t++]=c[r].x,e[t++]=c[r].y,e[t++]=c[r].z);for(;t<e.length;)e[t++]=0;v.attributes.position.needsUpdate=!0,v.setDrawRange(0,t/3)}w();let T=performance.now(),E=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,D=!0,O=null;function k(){if(!D){O=null;return}O=requestAnimationFrame(k);let e=(performance.now()-T)/1e3,t=f.array;for(let n=0;n<90;n++)t[n]=Math.max(0,Math.sin(e*u[n]+l[n]));f.needsUpdate=!0,C.rotation.y=e*.12,C.rotation.x=Math.sin(e*.07)*.18,i.render(a,o)}E?i.render(a,o):(new IntersectionObserver(e=>{D=e[0]?.isIntersecting??!0,D&&O===null&&(O=requestAnimationFrame(k))},{threshold:0}).observe(t),O=requestAnimationFrame(k)),window.addEventListener(`resize`,()=>{let e=r.offsetWidth,t=r.offsetHeight;i.setSize(e,t),o.aspect=e/t,o.updateProjectionMatrix()})};`requestIdleCallback`in window?requestIdleCallback(()=>n(),{timeout:1200}):setTimeout(n,200)}