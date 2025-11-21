import React, { useEffect, useRef } from 'react';
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  Vector3,
  Vector2,
  Clock,
  AdditiveBlending,
  Color
} from 'three';

// --- SHADER DEFINITIONS ---

const vertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uColorHero;
uniform vec3 uColorBg;

// 2D Rotation Matrix
mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

vec3 renderRibbon(
    vec2 uv,             
    vec2 center,         
    float angle,         
    float scale,         
    vec3 colorStart,     
    vec3 colorEnd,
    float timeOffset,    
    float phaseSpeed,    
    vec2 mousePos,
    float glowIntensity 
) {
    vec2 localUv = (uv - center) * rotate2d(angle) * scale;
    vec2 localMouse = (mousePos - center) * rotate2d(angle) * scale;
    
    vec3 accumulatedColor = vec3(0.0);
    float t = iTime * phaseSpeed + timeOffset;
    
    float gradientPos = smoothstep(-1.5, 1.5, localUv.x); 
    vec3 ribbonBaseColor = mix(colorStart, colorEnd, gradientPos);
    
    float blurLevel = smoothstep(1.0, 2.5, scale);
    
    // 35 Lines per ribbon
    for (int i = 0; i < 35; i++) {
        float fi = float(i);
        float progress = fi / 35.0; 
        
        float spineY = sin(localUv.x * 1.0 + t) * 0.3; 
        float twist = sin(localUv.x * 1.5 + t * 1.2) * 0.5 + 0.5; 
        float bundleOffset = (progress - 0.5) * 0.45 * (0.5 + twist);
        
        float mouseDistX = abs(localUv.x - localMouse.x);
        float mouseDistY = abs((spineY + bundleOffset) - localMouse.y);
        
        float influence = exp(-mouseDistX * 7.0) * exp(-mouseDistY * 7.0) * uHover;
        float vibration = sin(localUv.x * 40.0 - iTime * 20.0 + fi * 2.0) * 0.08 * influence;
        
        float lineY = spineY + bundleOffset + vibration;
        float dist = abs(localUv.y - lineY);
        
        float depthFade = 1.0 / (scale * 0.8);
        float edgeFade = smoothstep(2.5, 0.5, abs(localUv.x));
        
        float baseThickness = 0.003; 
        float blurThickness = 0.01; 
        float currentThickness = mix(baseThickness, blurThickness, blurLevel);
        
        float glow = glowIntensity / (dist + currentThickness);
        
        accumulatedColor += ribbonBaseColor * glow * depthFade * edgeFade;
    }
    
    return accumulatedColor;
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
  vec3 finalColor = vec3(0.0);
  
  // 1. HERO (Sharp, Low Glow)
  finalColor += renderRibbon(
      uv, vec2(0.0, 0.0), -0.1, 1.0,                  
      uColorHero, uColorHero,  
      0.0, 0.5, uMouse,
      0.00069 
  );

  // 2. TOP LEFT (Brighter + More Bloom)
  finalColor += renderRibbon(
      uv, vec2(-0.96, 0.6), -0.8, 1.5,                  
      uColorBg, uColorBg, 
      2.0, 0.3, uMouse,
      0.0010 
  );

  // 3. BOTTOM RIGHT (Brighter + More Bloom)
  finalColor += renderRibbon(
      uv, vec2(0.96, -0.19), -1.2, 1.5,                  
      uColorBg, uColorBg, 
      4.0, 0.4, uMouse,
      0.0010 
  );
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// --- PROPS & TYPES ---

interface HelixCanvasProps {
  /** The color of the central "Hero" ribbon. Defaults to #FFFFFF */
  heroColor?: string;
  /** The color of the two background ribbons. Defaults to #cccccc */
  backgroundColor?: string;
  /** Multiplier for the animation speed. Defaults to 1.0 */
  speed?: number;
  /** How quickly the mouse movement is smoothed (0.0 - 1.0). Defaults to 0.1 */
  mouseDamping?: number;
  /** CSS mix-blend-mode for the container (e.g., 'screen', 'lighten'). */
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  /** CSS opacity */
  opacity?: number;
}

/**
 * Helper to convert hex/string color to Three.js Vector3 (0-1 range)
 */
function colorToVec3(colorString: string): Vector3 {
  const c = new Color(colorString);
  return new Vector3(c.r, c.g, c.b);
}

export default function HelixCanvas({
  heroColor = '#ffffff',
  backgroundColor = '#cccccc', // Bright grey as requested (0.8 equivalent)
  speed = 1.0,
  mouseDamping = 0.1,
  mixBlendMode,
  opacity = 1
}: HelixCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<Vector2>(new Vector2(0, 0));
  const targetMouseRef = useRef<Vector2>(new Vector2(0, 0));
  const isHoveringRef = useRef<number>(0);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ 
      antialias: true, 
      alpha: true // Important for CSS blending
    });
    
    // Set high pixel ratio for sharpness
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    
    const el = containerRef.current;
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(el.clientWidth * dpr, el.clientHeight * dpr, 1) },
      uMouse: { value: new Vector2(0, 0) },
      uHover: { value: 0 },
      uColorHero: { value: colorToVec3(heroColor) },
      uColorBg: { value: colorToVec3(backgroundColor) },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      blending: AdditiveBlending, // Crucial for the glowing look
      depthTest: false,
      transparent: true
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    // -- Resize Observer --
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w * dpr, h * dpr, 1);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(el);

    // -- Mouse Events --
    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Standardize coordinates for the shader aspect ratio correction
      const resX = uniforms.iResolution.value.x;
      const resY = uniforms.iResolution.value.y;
      
      const nx = (2.0 * x * dpr - resX) / resY;
      const ny = -((2.0 * y * dpr - resY) / resY);
      
      targetMouseRef.current.set(nx, ny);
      isHoveringRef.current = 1;
    };

    const handlePointerLeave = () => {
      isHoveringRef.current = 0;
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    // -- Animation Loop --
    let raf = 0;
    const animate = () => {
      // Time
      uniforms.iTime.value = clock.getElapsedTime() * speed;

      // Smooth Mouse
      mouseRef.current.lerp(targetMouseRef.current, mouseDamping);
      uniforms.uMouse.value.copy(mouseRef.current);

      // Smooth Hover
      uniforms.uHover.value += (isHoveringRef.current - uniforms.uHover.value) * mouseDamping;

      // Update Colors (in case props change)
      uniforms.uColorHero.value.copy(colorToVec3(heroColor));
      uniforms.uColorBg.value.copy(colorToVec3(backgroundColor));

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [heroColor, backgroundColor, speed, mouseDamping]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        opacity: opacity,
        mixBlendMode: mixBlendMode,
        pointerEvents: 'auto' // Ensure mouse events work
      }}
    />
  );
}