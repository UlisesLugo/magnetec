import "./App.scss";
import * as THREE from "three";
import { useRef, useState } from "react";
import Particle from "./js/classes/particle.js";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  softShadows,
  MeshWobbleMaterial,
  OrbitControls,
} from "@react-three/drei";
import { useSpring, a } from "react-spring/three";

softShadows();

const prevLogic = () => {
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild( renderer.domElement );
  // use ref as a mount point of the Three.js scene instead of the document.body
  // document.body.appendChild(renderer.domElement);
  //let geometry = new THREE.SphereGeometry(1);
  //let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //let cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);

  /////// TEST PARTICLE /////////
  const geometry = new THREE.SphereGeometry(0.1, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    color: "gray",
    wireframe: false,
    side: THREE.DoubleSide,
  });
  let particle = new Particle(geometry, material);
  let meshParticle = particle.object;
  meshParticle.position.y = 0;
  scene.add(meshParticle);
  ///////////////////////////////

  camera.position.z = 5;
  let animate = function () {
    requestAnimationFrame(animate);

    // Using lorentz function to calculate forces in x, y and z.
    // Simulating the change in velocity by adding the force directly to the velocity.
    particle.xV += particle.lorentzFx(0, 0, 10);
    particle.yV += particle.lorentzFy(0.001, 0, 0);
    particle.zV += particle.lorentzFz(0, 10, 0);

    // Changing particle position
    particle.setPosition(
      particle.getXPosition() + particle.xV,
      particle.getYPosition() + particle.yV,
      particle.getZPosition() + particle.zV
    );

    renderer.render(scene, camera);
  };
  animate();
};

const SpinningMesh = ({ position, args, color, speed }) => {
  const mesh = useRef(null);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  const [expand, setExpand] = useState(false);

  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });

  return (
    <a.mesh
      onClick={() => setExpand(!expand)}
      scale={props.scale}
      castShadow
      ref={mesh}
      position={position}
    >
      <boxBufferGeometry attach="geometry" args={args} />
      <MeshWobbleMaterial
        attach="material"
        color={color}
        speed={speed}
        factor={0.6}
      />
    </a.mesh>
  );
};

function App() {
  return (
    <>
      <Canvas
        shadowMap
        colorManagement
        camera={{ position: [-5, 2, 10], fov: 60 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[0, 10, 0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <pointLight position={[0, -10, 0]} intensity={1.5} />

        <group>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}
            receiveShadow
          >
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            {/* <shadowMaterial attach="material" opacity={0.3} /> */}
            <meshStandardMaterial attach="material" color="yellow" />
          </mesh>

          <SpinningMesh
            position={[0, 1, 0]}
            args={[3, 2, 1]}
            color="lightblue"
            speed={2}
          />
          <SpinningMesh position={[-2, 1, -5]} color="pink" speed={6} />
          <SpinningMesh position={[5, 1, -2]} color="pink" speed={6} />
        </group>
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
