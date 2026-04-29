import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import type { Mesh } from "three";

function DemoMesh() {
  const ref = useRef<Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.25;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} castShadow receiveShadow>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#7c75ff"
          metalness={0.6}
          roughness={0.18}
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
}

export default function ModelViewer() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [2.4, 1.6, 2.8], fov: 42 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
      <Suspense fallback={null}>
        <DemoMesh />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
