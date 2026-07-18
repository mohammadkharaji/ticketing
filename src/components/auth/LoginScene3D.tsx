"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

/** Slow, elegant camera drift — enterprise, not playful */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      px * 0.35 + Math.sin(t * 0.08) * 0.08,
      0.025
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      1.15 + py * 0.18 + Math.cos(t * 0.06) * 0.05,
      0.025
    );
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 7.2, 0.02);
    state.camera.lookAt(0, 0.35, 0);
  });
  return null;
}

/** Architectural glass slab */
function GlassPanel({
  position,
  rotation,
  size = [1.8, 2.4, 0.08] as [number, number, number],
  delay = 0,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  size?: [number, number, number];
  delay?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(t * 0.35) * 0.06;
    ref.current.rotation.y = rotation[1] + Math.sin(t * 0.2) * 0.03;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <RoundedBox args={size} radius={0.04} smoothness={4}>
        <meshPhysicalMaterial
          color="#9eb6d9"
          metalness={0.15}
          roughness={0.08}
          transmission={0.88}
          thickness={0.6}
          ior={1.45}
          transparent
          opacity={0.95}
          envMapIntensity={1.4}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </RoundedBox>
      <mesh position={[0, 0, size[2] / 2 + 0.001]}>
        <planeGeometry args={[size[0] * 0.9, size[1] * 0.9]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.035} />
      </mesh>
    </group>
  );
}

/** Premium ticket card — matte + brushed metal accent */
function PremiumTicket({
  position,
  rotation,
  accent = "#3b82f6",
  delay = 0,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  accent?: string;
  delay?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.rotation.y = rotation[1] + Math.sin(t * 0.25) * 0.08;
    ref.current.rotation.x = rotation[0] + Math.cos(t * 0.2) * 0.04;
    ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.08;
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={1.05}>
      <RoundedBox args={[1.55, 1.0, 0.05]} radius={0.05} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.65}
          roughness={0.28}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          envMapIntensity={1.2}
        />
      </RoundedBox>
      {/* status accent strip */}
      <mesh position={[-0.62, 0, 0.032]}>
        <boxGeometry args={[0.07, 0.78, 0.01]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.45}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* content lines */}
      {[0.22, 0.06, -0.1, -0.26].map((y, i) => (
        <mesh key={i} position={[0.12, y, 0.032]}>
          <boxGeometry args={[i === 0 ? 0.85 : 0.65 - i * 0.08, 0.045, 0.008]} />
          <meshStandardMaterial
            color="#94a3b8"
            transparent
            opacity={0.28 - i * 0.03}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      ))}
      {/* priority chip */}
      <mesh position={[0.45, 0.28, 0.033]}>
        <boxGeometry args={[0.28, 0.1, 0.01]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.25}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

/** Soft orbiting ring — institutional, restrained */
function OrbitRing({
  radius,
  color,
  speed,
  tilt,
}: {
  radius: number;
  color: string;
  speed: number;
  tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0.2, 0]} position={[0, 0.4, -1.2]}>
      <torusGeometry args={[radius, 0.012, 12, 128]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        metalness={0.95}
        roughness={0.15}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

/** Network nodes — suggests connectivity / enterprise systems */
function NetworkNodes() {
  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const r = 2.4 + (i % 3) * 0.35;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * r,
          Math.sin(a * 1.3) * 0.55 + 0.5,
          Math.sin(a) * r * 0.45 - 1.5
        )
      );
    }
    return pts;
  }, []);

  const lineGeo = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const b = nodes[(i + 3) % nodes.length];
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [nodes]);

  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#334155" transparent opacity={0.35} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#60a5fa" : "#94a3b8"}
            emissive={i % 2 === 0 ? "#2563eb" : "#475569"}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function AmbientDust() {
  const count = 120;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = Math.random() * 6 - 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.018}
        color="#64748b"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Floor() {
  return (
    <group position={[0, -1.65, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#070b14" metalness={0.85} roughness={0.45} />
      </mesh>
      {/* perspective grid */}
      <gridHelper
        args={[28, 36, "#1e293b", "#111827"]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

function HeroCrystal() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.12;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.25}>
      <mesh ref={ref} position={[0, 0.55, -0.8]} castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshPhysicalMaterial
          color="#1e3a8a"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.5}
          transparent
          opacity={0.92}
          emissive="#1e40af"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#05080f"]} />
      <fog attach="fog" args={["#05080f", 10, 26]} />

      <ambientLight intensity={0.28} />
      <directionalLight
        castShadow
        position={[6, 10, 4]}
        intensity={1.15}
        color="#e2e8f0"
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 4, -2]} intensity={0.35} color="#64748b" />
      <pointLight position={[3, 2, 2]} intensity={0.55} color="#3b82f6" />
      <pointLight position={[-3.5, 1.5, 1]} intensity={0.4} color="#6366f1" />
      <spotLight
        position={[0, 8, 3]}
        angle={0.35}
        penumbra={0.9}
        intensity={0.9}
        color="#93c5fd"
        castShadow
      />

      <Environment preset="city" environmentIntensity={0.45} />

      <Floor />
      <ContactShadows
        position={[0, -1.64, 0]}
        opacity={0.45}
        scale={18}
        blur={2.5}
        far={6}
      />

      <AmbientDust />
      <NetworkNodes />
      <OrbitRing radius={2.1} color="#334155" speed={0.08} tilt={1.15} />
      <OrbitRing radius={2.65} color="#1e3a5f" speed={-0.05} tilt={0.95} />
      <OrbitRing radius={3.15} color="#1e293b" speed={0.035} tilt={1.35} />

      <HeroCrystal />

      <GlassPanel position={[-2.9, 0.5, -0.3]} rotation={[0.05, 0.55, 0.02]} delay={0} />
      <GlassPanel
        position={[3.1, 0.35, -0.6]}
        rotation={[-0.04, -0.5, -0.02]}
        size={[1.5, 2.1, 0.07]}
        delay={1.2}
      />

      <PremiumTicket
        position={[-2.2, 0.15, 0.9]}
        rotation={[0.15, 0.55, 0.08]}
        accent="#3b82f6"
        delay={0}
      />
      <PremiumTicket
        position={[2.35, 0.75, 0.5]}
        rotation={[-0.1, -0.65, -0.05]}
        accent="#6366f1"
        delay={0.8}
      />
      <PremiumTicket
        position={[1.6, -0.55, 1.1]}
        rotation={[0.25, -0.25, 0.1]}
        accent="#0ea5e9"
        delay={1.5}
      />
      <PremiumTicket
        position={[-1.4, 1.15, -0.2]}
        rotation={[-0.2, 0.85, -0.08]}
        accent="#818cf8"
        delay={2.1}
      />

      {/* soft horizon glow */}
      <mesh position={[0, -0.4, -4]}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#0c1a35" transparent opacity={0.35} />
      </mesh>

      <CameraRig />
    </>
  );
}

export default function LoginScene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.6]}
        shadows
        camera={{ position: [0, 1.2, 7.2], fov: 38, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContent />
      </Canvas>

      {/* Cinematic grade overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_10%,rgba(5,8,15,0.45)_55%,rgba(5,8,15,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05080f]/90 via-transparent to-[#05080f]/75" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080f] via-transparent to-[#05080f]/55" />
      {/* film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
