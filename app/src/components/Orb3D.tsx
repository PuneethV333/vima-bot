/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { VimaState } from "../types/vima.types";
import * as THREE from "three";

interface Orb3DProps {
    state: VimaState;
}

const STATE_CONFIG = {
    idle: {
        color: "#6366f1",
        emissive: "#4338ca",
        distort: 0.15,
        speed: 0.5,
        scale: 1,
        roughness: 0.4,
        metalness: 0.6,
    },
    listening: {
        color: "#10b981",
        emissive: "#059669",
        distort: 0.5,
        speed: 3,
        scale: 1.15,
        roughness: 0.2,
        metalness: 0.8,
    },
    thinking: {
        color: "#f59e0b",
        emissive: "#d97706",
        distort: 0.3,
        speed: 6,
        scale: 0.9,
        roughness: 0.3,
        metalness: 0.7,
    },
    speaking: {
        color: "#8b5cf6",
        emissive: "#7c3aed",
        distort: 0.4,
        speed: 4,
        scale: 1.1,
        roughness: 0.2,
        metalness: 0.8,
    },
    error: {
        color: "#ef4444",
        emissive: "#dc2626",
        distort: 0.8,
        speed: 2,
        scale: 1,
        roughness: 0.3,
        metalness: 0.5,
    },
};

// Floating particles around the orb
const Particles = ({ state }: { state: VimaState }) => {
    const particlesRef = useRef<THREE.Points>(null);
    const count = 80;

    const { geometry, velocities } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            pos[i3] = (Math.random() - 0.5) * 6;
            pos[i3 + 1] = (Math.random() - 0.5) * 6;
            pos[i3 + 2] = (Math.random() - 0.5) * 6;
            vel[i3] = (Math.random() - 0.5) * 0.01;
            vel[i3 + 1] = (Math.random() - 0.5) * 0.01;
            vel[i3 + 2] = (Math.random() - 0.5) * 0.01;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        return { geometry: geo, velocities: vel };
    }, []);

    useFrame((_, delta) => {
        if (!particlesRef.current) return;
        const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const isActive = state === "listening" || state === "speaking";
        const speed = state === "thinking" ? 2 : isActive ? 1 : 0.3;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            posArray[i3] += velocities[i3] * speed;
            posArray[i3 + 1] += velocities[i3 + 1] * speed;
            posArray[i3 + 2] += velocities[i3 + 2] * speed;

            if (Math.abs(posArray[i3]) > 3) posArray[i3] *= -0.8;
            if (Math.abs(posArray[i3 + 1]) > 3) posArray[i3 + 1] *= -0.8;
            if (Math.abs(posArray[i3 + 2]) > 3) posArray[i3 + 2] *= -0.8;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y += delta * speed * 0.2;
    });

    const particleColor = STATE_CONFIG[state].color;

    return (
        <points ref={particlesRef} geometry={geometry}>
            <pointsMaterial
                size={0.03}
                color={particleColor}
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};

// Light that orbits the orb
const OrbitingLight = ({
    state,
    radius,
    speed,
    color,
    delay = 0,
}: {
    state: VimaState;
    radius: number;
    speed: number;
    color: string;
    delay?: number;
}) => {
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame(() => {
        if (!lightRef.current) return;
        const time = Date.now() * 0.001 * speed + delay;
        lightRef.current.position.x = Math.cos(time) * radius;
        lightRef.current.position.y = Math.sin(time * 0.7) * radius * 0.5;
        lightRef.current.position.z = Math.sin(time) * radius;
    });

    const intensity = state === "idle" ? 0.3 : 0.8;

    return (
        <pointLight
            ref={lightRef}
            color={color}
            intensity={intensity}
            distance={8}
            decay={2}
        />
    );
};

// Ring that orbits the orb
const OrbitRing = ({ state }: { state: VimaState }) => {
    const ringRef = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (ringRef.current) {
            ringRef.current.rotation.x += delta * (state === "idle" ? 0.1 : 0.5);
            ringRef.current.rotation.y += delta * (state === "idle" ? 0.15 : 0.7);
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.x -= delta * (state === "idle" ? 0.12 : 0.4);
            ring2Ref.current.rotation.z += delta * (state === "idle" ? 0.08 : 0.6);
        }
    });

    const scale = STATE_CONFIG[state].scale;

    return (
        <group>
            <mesh ref={ringRef} scale={[scale * 1.6, scale * 1.6, scale * 1.6]}>
                <torusGeometry args={[1, 0.005, 16, 100]} />
                <meshBasicMaterial
                    color={STATE_CONFIG[state].color}
                    transparent
                    opacity={state === "idle" ? 0.15 : 0.35}
                />
            </mesh>
            <mesh ref={ring2Ref} scale={[scale * 2.0, scale * 2.0, scale * 2.0]}>
                <torusGeometry args={[1, 0.003, 16, 100]} />
                <meshBasicMaterial
                    color={STATE_CONFIG[state].emissive}
                    transparent
                    opacity={state === "idle" ? 0.08 : 0.2}
                />
            </mesh>
        </group>
    );
};

// Main Orb mesh
const OrbMesh = ({ state }: { state: VimaState }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const targetScale = useRef(1);
    const currentConfig = STATE_CONFIG[state];

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        targetScale.current = currentConfig.scale;
        meshRef.current.scale.lerp(
            new THREE.Vector3(targetScale.current, targetScale.current, targetScale.current),
            delta * 4
        );

        const time = Date.now() * 0.001;
        const bobIntensity = state === "listening" ? 0.15 : state === "speaking" ? 0.1 : 0.05;
        meshRef.current.position.y = Math.sin(time * 1.5) * bobIntensity;

        meshRef.current.rotation.y += delta * (state === "thinking" ? 1.5 : 0.2);
        meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    });

    return (
        <Sphere ref={meshRef} args={[1, 128, 128]}>
            <MeshDistortMaterial
                color={currentConfig.color}
                emissive={currentConfig.emissive}
                emissiveIntensity={state === "idle" ? 0.2 : state === "error" ? 0.8 : 0.5}
                roughness={currentConfig.roughness}
                metalness={currentConfig.metalness}
                distort={currentConfig.distort}
                speed={currentConfig.speed}
                transparent
                opacity={0.95}
            />
        </Sphere>
    );
};

// Ambient glow light
const GlowLight = ({ state }: { state: VimaState }) => {
    const lightRef = useRef<THREE.PointLight>(null);
    const intensity = state === "idle" ? 1.5 : state === "error" ? 3 : 2.5;

    useFrame(() => {
        if (!lightRef.current) return;
        const time = Date.now() * 0.001;
        const pulse = state === "listening"
            ? Math.sin(time * 8) * 0.5 + 1
            : state === "speaking"
                ? Math.sin(time * 6) * 0.3 + 1
                : 1;
        lightRef.current.intensity = intensity * pulse;
    });

    return (
        <pointLight
            ref={lightRef}
            position={[0, 0, 0]}
            color={STATE_CONFIG[state].color}
            intensity={intensity}
            distance={10}
            decay={2}
        />
    );
};

export const Orb3D = ({ state }: Orb3DProps) => {
    return (
        <>
            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 5, 5]} intensity={0.3} />
            <directionalLight position={[-5, -5, -5]} intensity={0.1} color={STATE_CONFIG[state].emissive} />

            <GlowLight state={state} />
            <OrbMesh state={state} />
            <OrbitRing state={state} />
            <Particles state={state} />

            {/* Secondary orbiting lights for dynamic shading */}
            <OrbitingLight state={state} radius={3} speed={1} color={STATE_CONFIG[state].color} />
            <OrbitingLight state={state} radius={4} speed={-0.7} color={STATE_CONFIG[state].emissive} delay={2} />
        </>
    );
};

export default Orb3D;
