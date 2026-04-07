// Real-time ordered dithering background using WebGL.
// Applies a 4x4 Bayer matrix dither to either a <video> source
// or procedural animated content (simplex noise).

/** Canvas pixels per CSS pixel — controls the "chunkiness" of the dither */
const SCALE = 1;

const VERT = /* glsl */ `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform vec2      u_res;
uniform float     u_time;
uniform vec3      u_fg;
uniform vec3      u_bg;
uniform sampler2D u_bayer;
uniform sampler2D u_video;
uniform float     u_useVideo;
uniform vec2      u_mouse;
uniform float     u_mouseStr;

/* ---- Simplex 2-D noise (Ashima Arts / Ian McEwan) ---- */

vec3 mod289(vec3 x) { return x - floor(x / 289.0) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x / 289.0) * 289.0; }
vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,   // (3 - sqrt(3)) / 6
    0.366025403784439,   // 0.5 * (sqrt(3) - 1)
   -0.577350269189626,   // -1 + 2 * C.x
    0.024390243902439    // 1 / 41
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x   + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* ---- Main ---- */

void main() {
  vec2 pixel = floor(gl_FragCoord.xy);
  vec2 uv    = pixel / u_res;

  float lum;

  if (u_useVideo > 0.5) {
    // Sample video (flip Y for correct orientation)
    vec4 tex = texture2D(u_video, vec2(uv.x, 1.0 - uv.y));
    lum = dot(tex.rgb, vec3(0.2126, 0.7152, 0.0722));
  } else {
    // Procedural placeholder: layered organic noise
    float t = u_time;
    vec2 p  = (uv - 0.5) * vec2(u_res.x / u_res.y, 1.0);

    float n1 = snoise(p * 1.0  + vec2( t * 0.08,   t * 0.055));
    float n2 = snoise(p * 2.2  + vec2(-t * 0.06,   t * 0.04 ));
    float n3 = snoise(p * 4.5  + vec2( t * 0.025, -t * 0.035));

    lum = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;
    lum = lum * 0.5 + 0.5;

    // Vignette
    lum *= 1.0 - smoothstep(0.3, 1.2, length(p));

    // Keep subtle for background use
    lum *= 0.5;
  }

  // Mouse interaction — radial glow around cursor
  vec2 mouseUV   = vec2(u_mouse.x, 1.0 - u_mouse.y);
  vec2 aspect    = vec2(u_res.x / u_res.y, 1.0);
  vec2 mWorld    = (mouseUV - 0.5) * aspect;
  vec2 fWorld    = (uv - 0.5) * aspect;
  float mDist    = length(fWorld - mWorld);
  float glow     = smoothstep(0.5, 0.0, mDist) * 0.4 * u_mouseStr;
  lum = clamp(lum + glow, 0.0, 1.0);

  // 4x4 Bayer ordered dithering
  vec2 bayerUV    = (mod(pixel, 4.0) + 0.5) / 4.0;
  float threshold = texture2D(u_bayer, bayerUV).r;

  vec3 color = (lum > threshold) ? u_fg : u_bg;
  gl_FragColor = vec4(color, 1.0);
}`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function readColors(): { fg: RGB; bg: RGB } {
  const s = getComputedStyle(document.documentElement);
  const bg = hexToRgb(s.getPropertyValue("--color-canvas").trim());
  const accent = hexToRgb(s.getPropertyValue("--color-accent").trim());
  return { bg, fg: lerpRgb(bg, accent, 0.25) };
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Dither shader error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/* ------------------------------------------------------------------ */
/*  4x4 Bayer matrix as a tiling LUMINANCE texture                    */
/*  Values = Bayer index / 16 * 255                                   */
/* ------------------------------------------------------------------ */

// prettier-ignore
const BAYER = new Uint8Array([
    0, 128,  32, 160,
  192,  64, 224,  96,
   48, 176,  16, 144,
  240, 112, 208,  80,
]);

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

/**
 * Boot the dithered-background renderer on a canvas element.
 * Returns a cleanup function that tears down GL resources and observers.
 */
export function initDitherBackground(
  canvas: HTMLCanvasElement,
  video?: HTMLVideoElement,
): () => void {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) return () => {};

  /* ---------- Program ---------- */

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return () => {};

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Dither link error:", gl.getProgramInfoLog(prog));
    return () => {};
  }
  gl.useProgram(prog);

  /* ---------- Fullscreen quad ---------- */

  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  /* ---------- Bayer texture (unit 0) ---------- */

  const bayerTex = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bayerTex);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.LUMINANCE, 4, 4, 0,
    gl.LUMINANCE, gl.UNSIGNED_BYTE, BAYER,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  /* ---------- Video texture (unit 1, optional) ---------- */

  const useVideo = !!(video?.src);
  let videoTex: WebGLTexture | null = null;

  if (useVideo) {
    videoTex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, videoTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  /* ---------- Uniforms ---------- */

  const loc = {
    res: gl.getUniformLocation(prog, "u_res"),
    time: gl.getUniformLocation(prog, "u_time"),
    fg: gl.getUniformLocation(prog, "u_fg"),
    bg: gl.getUniformLocation(prog, "u_bg"),
    bayer: gl.getUniformLocation(prog, "u_bayer"),
    video: gl.getUniformLocation(prog, "u_video"),
    useVideo: gl.getUniformLocation(prog, "u_useVideo"),
    mouse: gl.getUniformLocation(prog, "u_mouse"),
    mouseStr: gl.getUniformLocation(prog, "u_mouseStr"),
  };

  gl.uniform1i(loc.bayer, 0);
  gl.uniform1i(loc.video, 1);
  gl.uniform1f(loc.useVideo, useVideo ? 1.0 : 0.0);

  /* ---------- Sizing ---------- */

  function resize() {
    const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.ceil(cssW / SCALE));
    const h = Math.max(1, Math.ceil(cssH / SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ---------- Theme colors ---------- */

  let colors = readColors();

  // Colors are static (no theme switching), so no observer needed.

  /* ---------- Mouse tracking ---------- */

  const mouseTarget = [0.5, 0.5];
  const mouseCurrent = [0.5, 0.5];
  let mouseOver = false;
  let mouseStr = 0;

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouseTarget[0] = (e.clientX - rect.left) / rect.width;
    mouseTarget[1] = (e.clientY - rect.top) / rect.height;
    mouseOver =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
  };
  window.addEventListener("pointermove", onPointerMove);

  /* ---------- Reduced motion ---------- */

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = mq.matches;
  const onMq = (e: MediaQueryListEvent) => {
    reduced = e.matches;
  };
  mq.addEventListener("change", onMq);

  /* ---------- Render loop ---------- */

  let destroyed = false;
  let raf = 0;
  const t0 = performance.now();

  function frame() {
    if (destroyed) return;

    const elapsed = (performance.now() - t0) / 1000;

    // Smooth mouse interpolation
    const ease = 0.08;
    mouseCurrent[0] += (mouseTarget[0] - mouseCurrent[0]) * ease;
    mouseCurrent[1] += (mouseTarget[1] - mouseCurrent[1]) * ease;
    mouseStr += ((mouseOver ? 1.0 : 0.0) - mouseStr) * 0.05;

    gl!.uniform2f(loc.res, canvas.width, canvas.height);
    gl!.uniform1f(loc.time, reduced ? 0 : elapsed);
    gl!.uniform3fv(loc.fg, colors.fg);
    gl!.uniform3fv(loc.bg, colors.bg);
    gl!.uniform2f(loc.mouse, mouseCurrent[0], mouseCurrent[1]);
    gl!.uniform1f(loc.mouseStr, mouseStr);

    if (useVideo && video!.readyState >= video!.HAVE_CURRENT_DATA) {
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, videoTex);
      gl!.texImage2D(
        gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, video!,
      );
    }

    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(frame);
  }

  frame();

  /* ---------- Cleanup ---------- */

  return () => {
    destroyed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    mq.removeEventListener("change", onMq);
    gl!.deleteProgram(prog);
    gl!.deleteShader(vs);
    gl!.deleteShader(fs);
    gl!.deleteBuffer(buf);
    gl!.deleteTexture(bayerTex);
    if (videoTex) gl!.deleteTexture(videoTex);
  };
}
