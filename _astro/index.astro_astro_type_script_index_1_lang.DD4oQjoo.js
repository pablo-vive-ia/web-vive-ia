import{t as e}from"./preload-helper.DygEbaNj.js";var t=document.getElementById(`canvas-no-caos`);if(t){let n=async()=>{let n=await e(()=>import(`./three.BmtxskG-.js`),[]),r=new n.WebGLRenderer({canvas:t,antialias:!0,alpha:!0});r.setPixelRatio(Math.min(window.devicePixelRatio,2)),r.setClearColor(0,0);let i=t.parentElement;r.setSize(i.offsetWidth,i.offsetHeight);let a=new n.Scene,o=new n.PerspectiveCamera(60,i.offsetWidth/i.offsetHeight,.1,100);o.position.z=6;let s=[],c=[],l=new Float32Array(50),u=new Float32Array(50);for(let e=0;e<50;e++)l[e]=Math.random()*Math.PI*2,u[e]=.6+Math.random()*1.4,s.push(new n.Vector3((Math.random()-.5)*10,(Math.random()-.5)*6,(Math.random()-.5)*4)),c.push(new n.Vector3((Math.random()-.5)*.004,(Math.random()-.5)*.004,(Math.random()-.5)*.004));let d=new n.BufferAttribute(new Float32Array(50),1),f=new n.BufferGeometry,p=new Float32Array(150);s.forEach((e,t)=>{p[t*3]=e.x,p[t*3+1]=e.y,p[t*3+2]=e.z}),f.setAttribute(`position`,new n.BufferAttribute(p,3)),f.setAttribute(`flash`,d);let m=new n.ShaderMaterial({transparent:!0,uniforms:{pointSize:{value:6*window.devicePixelRatio}},vertexShader:`
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
        `}),h=new n.Points(f,m);a.add(h);let g=new n.LineBasicMaterial({color:8141549,transparent:!0,opacity:.22}),_=new n.BufferGeometry,v=new Float32Array(15e3);_.setAttribute(`position`,new n.BufferAttribute(v,3));let y=new n.LineSegments(_,g);a.add(y);function b(){let e=_.attributes.position.array,t=0;for(let n=0;n<50;n++)for(let r=n+1;r<50;r++)s[n].distanceTo(s[r])<2&&(e[t++]=s[n].x,e[t++]=s[n].y,e[t++]=s[n].z,e[t++]=s[r].x,e[t++]=s[r].y,e[t++]=s[r].z);for(;t<e.length;)e[t++]=0;_.attributes.position.needsUpdate=!0,_.setDrawRange(0,t/3)}let x=new n.Clock,S=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,C=!0,w=null;function T(){if(!C){w=null;return}w=requestAnimationFrame(T);let e=x.getElapsedTime(),t=d.array;for(let n=0;n<50;n++)t[n]=Math.max(0,Math.sin(e*u[n]+l[n]));d.needsUpdate=!0;for(let e=0;e<50;e++)s[e].add(c[e]),Math.abs(s[e].x)>5&&(c[e].x*=-1),Math.abs(s[e].y)>3&&(c[e].y*=-1),Math.abs(s[e].z)>2&&(c[e].z*=-1);let n=f.attributes.position.array;s.forEach((e,t)=>{n[t*3]=e.x,n[t*3+1]=e.y,n[t*3+2]=e.z}),f.attributes.position.needsUpdate=!0,b(),a.rotation.y+=.002,r.render(a,o)}S?r.render(a,o):(new IntersectionObserver(e=>{C=e[0]?.isIntersecting??!0,C&&w===null&&(w=requestAnimationFrame(T))},{threshold:0}).observe(t),w=requestAnimationFrame(T)),window.addEventListener(`resize`,()=>{let e=i.offsetWidth,t=i.offsetHeight;r.setSize(e,t),o.aspect=e/t,o.updateProjectionMatrix()})},r=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&(r.disconnect(),n())},{rootMargin:`800px 0px`});r.observe(t)}