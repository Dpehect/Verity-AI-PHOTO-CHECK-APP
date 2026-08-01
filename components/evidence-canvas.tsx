"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
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
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.22, 0.045);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.12, 0.045);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.22}>
      <group ref={group} rotation={[0.04, -0.1, -0.04]}>
        <RoundedBox args={[3.65, 2.42, 0.12]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#dcd9d0" roughness={0.72} />
        </RoundedBox>
        <mesh position={[0, 0.08, 0.08]}>
          <planeGeometry args={[3.42, 1.85, 48, 32]} />
          <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
        </mesh>
        <mesh position={[0, -1.02, 0.1]}>
          <planeGeometry args={[3.2, 0.05]} />
          <meshBasicMaterial color="#315cff" />
        </mesh>
        {[-0.22, 0, 0.22].map((z, index) => (
          <mesh key={z} position={[0.1 + index * 0.13, 0.04, z - 0.45]} rotation={[0, 0, -0.04]}>
            <planeGeometry args={[3.1, 1.7]} />
            <meshBasicMaterial color={index === 0 ? "#315cff" : "#ff5c35"} transparent opacity={0.065} wireframe />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function EvidenceCanvas() {
  return (
    <div className="evidence-canvas" aria-hidden="true">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 5.4], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 3, 4]} intensity={3} />
        <EvidenceObject />
      </Canvas>
    </div>
  );
}
