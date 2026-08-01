"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying float vWave;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    float wave = sin(p.y * 5.0 + uTime) * 0.025;
    p.z += wave;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vWave;
  uniform float uTime;
  void main() {
    vec3 blue = vec3(0.12, 0.28, 1.0);
    vec3 orange = vec3(1.0, 0.22, 0.08);
    float ridge = smoothstep(0.44, 0.46, vUv.y + sin(vUv.x * 7.0) * 0.12);
    vec3 color = mix(vec3(0.025), blue, ridge);
    float sun = 1.0 - smoothstep(0.0, 0.15, distance(vUv, vec2(0.72, 0.7)));
    color = mix(color, orange, sun);
    float scan = 1.0 - smoothstep(0.0, 0.025, abs(fract(vUv.y * 18.0 - uTime * 0.18) - 0.5));
    color += scan * 0.045;
    gl_FragColor = vec4(color + vWave, 1.0);
  }
`;

function EvidenceObject() {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock, pointer }) => {
    if (!group.current || !material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.22,
      0.045,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.12,
      0.045,
    );
    group.current.position.y = Math.sin(clock.elapsedTime * 1.35) * 0.06;
  });

  return (
    <group ref={group} rotation={[0.04, -0.1, -0.04]}>
      <mesh>
        <boxGeometry args={[3.65, 2.42, 0.12, 2, 2, 1]} />
        <meshStandardMaterial color="#dcd9d0" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.08, 0.08]}>
        <planeGeometry args={[3.42, 1.85, 48, 32]} />
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <mesh position={[0, -1.02, 0.1]}>
        <planeGeometry args={[3.2, 0.05]} />
        <meshBasicMaterial color="#315cff" />
      </mesh>
      {[-0.22, 0, 0.22].map((z, index) => (
        <mesh
          key={z}
          position={[0.1 + index * 0.13, 0.04, z - 0.45]}
          rotation={[0, 0, -0.04]}
        >
          <planeGeometry args={[3.1, 1.7]} />
          <meshBasicMaterial
            color={index === 0 ? "#315cff" : "#ff5c35"}
            transparent
            opacity={0.065}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

export function EvidenceCanvas() {
  const [profile, setProfile] = useState<"checking" | "full" | "fallback">(
    "checking",
  );
  const [contextLost, setContextLost] = useState(false);
  const canvasElement = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const constrained =
      (nav.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4;
    const nextProfile = reduced || constrained ? "fallback" : "full";
    const frame = window.requestAnimationFrame(() => {
      setProfile(nextProfile);
      if (nextProfile === "fallback")
        window.dispatchEvent(new CustomEvent("verity:webgl-ready"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const canvas = canvasElement.current;
    if (!canvas) return;
    const lost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    const restored = () => setContextLost(false);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [profile]);

  if (profile === "checking")
    return (
      <div className="canvas-fallback">
        <ScanFallbackLabel label="Checking graphics profile" />
      </div>
    );
  if (profile === "fallback" || contextLost)
    return (
      <div className="canvas-fallback canvas-fallback--visual">
        <div className="fallback-evidence">
          <span />
          <i />
        </div>
        <ScanFallbackLabel
          label={
            contextLost
              ? "Graphics context recovering"
              : "Optimized evidence preview"
          }
        />
      </div>
    );

  return (
    <div className="evidence-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          canvasElement.current = gl.domElement;
          window.requestAnimationFrame(() =>
            window.dispatchEvent(new CustomEvent("verity:webgl-ready")),
          );
        }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 3, 4]} intensity={3} />
        <EvidenceObject />
      </Canvas>
    </div>
  );
}

function ScanFallbackLabel({ label }: { label: string }) {
  return <span className="canvas-fallback__label">{label}</span>;
}
