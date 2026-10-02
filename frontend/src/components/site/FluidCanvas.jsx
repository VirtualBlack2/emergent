import { useEffect, useRef } from "react";

const VERT = `precision highp float;
attribute vec2 aPosition;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform vec2 texelSize;
void main(){vUv=aPosition*0.5+0.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`;

const HEAD = `precision highp float; precision highp sampler2D;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;`;

const FRAG = {
  clear: `uniform sampler2D uTexture; uniform float value; void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`,
  display: `uniform sampler2D uTexture; void main(){vec3 c=texture2D(uTexture,vUv).rgb; c=pow(c,vec3(0.9)); float a=clamp(max(c.r,max(c.g,c.b)),0.,1.); gl_FragColor=vec4(c,a);}`,
  splat: `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
    void main(){vec2 p=vUv-point; p.x*=aspectRatio; vec3 s=exp(-dot(p,p)/radius)*color; gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+s,1.);}`,
  advection: `uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
    void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize; gl_FragColor=texture2D(uSource,coord)/(1.+dissipation*dt);}`,
  divergence: `uniform sampler2D uVelocity;
    void main(){float L=texture2D(uVelocity,vL).x; float R=texture2D(uVelocity,vR).x; float T=texture2D(uVelocity,vT).y; float B=texture2D(uVelocity,vB).y;
    vec2 C=texture2D(uVelocity,vUv).xy; if(vL.x<0.)L=-C.x; if(vR.x>1.)R=-C.x; if(vT.y>1.)T=-C.y; if(vB.y<0.)B=-C.y;
    gl_FragColor=vec4(0.5*(R-L+T-B),0.,0.,1.);}`,
  curl: `uniform sampler2D uVelocity;
    void main(){float L=texture2D(uVelocity,vL).y; float R=texture2D(uVelocity,vR).y; float T=texture2D(uVelocity,vT).x; float B=texture2D(uVelocity,vB).x;
    gl_FragColor=vec4(0.5*(R-L-T+B),0.,0.,1.);}`,
  vorticity: `uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
    void main(){float L=texture2D(uCurl,vL).x; float R=texture2D(uCurl,vR).x; float T=texture2D(uCurl,vT).x; float B=texture2D(uCurl,vB).x; float C=texture2D(uCurl,vUv).x;
    vec2 f=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L)); f/=length(f)+0.0001; f*=curl*C; f.y*=-1.;
    vec2 v=texture2D(uVelocity,vUv).xy+f*dt; v=min(max(v,-1000.),1000.); gl_FragColor=vec4(v,0.,1.);}`,
  pressure: `uniform sampler2D uPressure; uniform sampler2D uDivergence;
    void main(){float L=texture2D(uPressure,vL).x; float R=texture2D(uPressure,vR).x; float T=texture2D(uPressure,vT).x; float B=texture2D(uPressure,vB).x;
    gl_FragColor=vec4((L+R+B+T-texture2D(uDivergence,vUv).x)*0.25,0.,0.,1.);}`,
  gradient: `uniform sampler2D uPressure; uniform sampler2D uVelocity;
    void main(){float L=texture2D(uPressure,vL).x; float R=texture2D(uPressure,vR).x; float T=texture2D(uPressure,vT).x; float B=texture2D(uPressure,vB).x;
    vec2 v=texture2D(uVelocity,vUv).xy-vec2(R-L,T-B); gl_FragColor=vec4(v,0.,1.);}`,
};

const CFG = { SIM: 128, DYE: 1024, DENSITY: 1.4, VELOCITY: 0.35, PRESSURE: 0.8, ITER: 20, CURL: 22, RADIUS: 0.22, FORCE: 6000 };
const PALETTE = [[0.2, 0.89, 0.6], [0.1, 0.72, 0.5], [0.05, 0.6, 0.55], [0.55, 0.95, 0.4], [0.1, 0.55, 0.75]];

function startFluid(canvas) {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: false });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
  const isMobile = window.innerWidth < 768;
  const dyeRes = isMobile ? 512 : CFG.DYE;

  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const programs = {};
  for (const [k, src] of Object.entries(FRAG)) {
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, HEAD + src));
    gl.bindAttribLocation(p, 0, "aPosition"); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
    programs[k] = { p, u };
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const blit = (t) => {
    if (t) { gl.viewport(0, 0, t.w, t.h); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); }
    else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };
  const fbo = (w, h) => {
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
    return { fbo: f, w, h, tx: 1 / w, ty: 1 / h, attach: (id) => { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; } };
  };
  const dbl = (w, h) => {
    const o = { read: fbo(w, h), write: fbo(w, h) };
    o.swap = () => { const t = o.read; o.read = o.write; o.write = t; };
    return o;
  };
  const res = (r) => {
    let a = gl.drawingBufferWidth / gl.drawingBufferHeight; if (a < 1) a = 1 / a;
    const mn = Math.round(r), mx = Math.round(r * a);
    return gl.drawingBufferWidth > gl.drawingBufferHeight ? [mx, mn] : [mn, mx];
  };

  let dye, vel, div, curl, prs;
  const sizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(canvas.clientWidth * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);
    const [sw, sh] = res(CFG.SIM), [dw, dh] = res(dyeRes);
    dye = dbl(dw, dh); vel = dbl(sw, sh); div = fbo(sw, sh); curl = fbo(sw, sh); prs = dbl(sw, sh);
  };
  sizeCanvas();

  const use = (k) => { gl.useProgram(programs[k].p); return programs[k].u; };
  const aspect = () => canvas.width / canvas.height;

  const splat = (x, y, dx, dy, color) => {
    let u = use("splat");
    gl.uniform1i(u.uTarget, vel.read.attach(0));
    gl.uniform1f(u.aspectRatio, aspect());
    gl.uniform2f(u.point, x, y);
    gl.uniform3f(u.color, dx, dy, 0);
    const r = CFG.RADIUS / 100;
    gl.uniform1f(u.radius, aspect() > 1 ? r * aspect() : r);
    blit(vel.write); vel.swap();
    gl.uniform1i(u.uTarget, dye.read.attach(0));
    gl.uniform3f(u.color, color[0], color[1], color[2]);
    blit(dye.write); dye.swap();
  };

  const step = (dt) => {
    gl.disable(gl.BLEND);
    let u = use("curl");
    gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
    gl.uniform1i(u.uVelocity, vel.read.attach(0)); blit(curl);
    u = use("vorticity");
    gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
    gl.uniform1i(u.uVelocity, vel.read.attach(0)); gl.uniform1i(u.uCurl, curl.attach(1));
    gl.uniform1f(u.curl, CFG.CURL); gl.uniform1f(u.dt, dt); blit(vel.write); vel.swap();
    u = use("divergence");
    gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
    gl.uniform1i(u.uVelocity, vel.read.attach(0)); blit(div);
    u = use("clear");
    gl.uniform1i(u.uTexture, prs.read.attach(0)); gl.uniform1f(u.value, CFG.PRESSURE); blit(prs.write); prs.swap();
    u = use("pressure");
    gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
    gl.uniform1i(u.uDivergence, div.attach(0));
    for (let i = 0; i < CFG.ITER; i++) { gl.uniform1i(u.uPressure, prs.read.attach(1)); blit(prs.write); prs.swap(); }
    u = use("gradient");
    gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
    gl.uniform1i(u.uPressure, prs.read.attach(0)); gl.uniform1i(u.uVelocity, vel.read.attach(1)); blit(vel.write); vel.swap();
    u = use("advection");
    gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
    gl.uniform1i(u.uVelocity, vel.read.attach(0)); gl.uniform1i(u.uSource, vel.read.attach(0));
    gl.uniform1f(u.dt, dt); gl.uniform1f(u.dissipation, CFG.VELOCITY); blit(vel.write); vel.swap();
    gl.uniform1i(u.uVelocity, vel.read.attach(0)); gl.uniform1i(u.uSource, dye.read.attach(1));
    gl.uniform1f(u.dissipation, CFG.DENSITY); blit(dye.write); dye.swap();
  };

  const render = () => {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
    const u = use("display");
    gl.uniform1i(u.uTexture, dye.read.attach(0)); blit(null);
  };

  let ci = 0;
  const pickColor = (k = 0.18) => { ci = (ci + 1) % (PALETTE.length * 40); const c = PALETTE[Math.floor(ci / 40)]; return c.map((v) => v * k); };
  const ptr = { x: 0, y: 0, moved: false, dx: 0, dy: 0, init: false };
  const onMove = (cx, cy) => {
    const x = cx / window.innerWidth, y = 1 - cy / window.innerHeight;
    if (!ptr.init) { ptr.x = x; ptr.y = y; ptr.init = true; return; }
    const a = aspect();
    ptr.dx = (x - ptr.x) * (a < 1 ? a : 1); ptr.dy = (y - ptr.y) / (a > 1 ? a : 1);
    ptr.x = x; ptr.y = y; ptr.moved = Math.abs(ptr.dx) + Math.abs(ptr.dy) > 0;
  };
  const mm = (e) => onMove(e.clientX, e.clientY);
  const tm = (e) => { const t = e.touches[0]; if (t) onMove(t.clientX, t.clientY); };
  const ts = () => { ptr.init = false; };
  window.addEventListener("mousemove", mm, { passive: true });
  window.addEventListener("touchmove", tm, { passive: true });
  window.addEventListener("touchstart", ts, { passive: true });

  const burst = (n) => {
    for (let i = 0; i < n; i++) {
      const c = pickColor(0.9);
      splat(Math.random(), Math.random() * 0.8 + 0.1, 900 * (Math.random() - 0.5), 900 * (Math.random() - 0.5), c);
    }
  };
  burst(5);

  const onBurst = (e) => {
    const { x = 0.5, y = 0.5 } = e.detail || {};
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
      const f = 1600 + Math.random() * 1000;
      splat(x, y, Math.cos(a) * f, Math.sin(a) * f, PALETTE[i % PALETTE.length].map((v) => v * 0.45));
    }
  };
  window.addEventListener("fluid-burst", onBurst);

  let last = performance.now(), raf, idle = 0, lastW = window.innerWidth;
  const loop = () => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.016666);
    last = now;
    if (ptr.moved) {
      ptr.moved = false; idle = 0;
      splat(ptr.x, ptr.y, ptr.dx * CFG.FORCE, ptr.dy * CFG.FORCE, pickColor());
    } else if ((idle += dt) > 3.5) { idle = 0; burst(1); }
    step(dt); render();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const onResize = () => { if (Math.abs(window.innerWidth - lastW) > 40) { lastW = window.innerWidth; sizeCanvas(); } };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", mm);
    window.removeEventListener("touchmove", tm);
    window.removeEventListener("touchstart", ts);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("fluid-burst", onBurst);
  };
}

export const FluidCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    let stop = null;
    try { stop = startFluid(ref.current); } catch (e) { stop = null; }
    return () => { if (stop) stop(); };
  }, []);
  return <canvas ref={ref} data-testid="fluid-canvas" className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" />;
};
