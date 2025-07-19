// @ts-nocheck
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import * as THREE from 'three';


// GLSL Shaders for the glassmorphism effect
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float u_time;

  // 2D Random function
  float random (vec2 st) {
      return fract(sin(dot(st.xy,
                           vec2(12.9898,78.233)))*
          43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    // Add time to the uv to animate the noise
    uv += u_time * 0.02;
    float noise = random(uv * 50.0);

    // Create a frosted glass effect by mixing color with noise
    vec3 color = mix(vec3(0.0, 0.98, 0.78), vec3(1.0, 0.0, 0.33), smoothstep(0.4, 0.6, vUv.y));
    color += vec3(noise * 0.15);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const AnimatedBackground = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
    }),
    []
  );

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const HeroSection = () => {
  // Framer Motion variants for the text animation
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3 + 0.5, // Staggered delay
        duration: 0.8,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <AnimatedBackground />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          className="text-9xl md:text-[200px] font-bold text-neon-cyan neon-text-pink"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          Pourquoi Catchy ?
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl font-light text-white mt-4 tracking-widest"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          Qualité • Service 7/7 • Meilleur prix
        </motion.p>
        <motion.div
          className="mt-12"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          {/* Placeholder for the GlassButton component */}
          <button className="px-8 py-3 font-semibold text-white border-2 border-neon-cyan rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300">
            Découvrir nos produits
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
