import "./App.scss";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import Particle from "./js/classes/particle.js";
import tweakpane from "tweakpane";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import { useSpring, a } from "react-spring/three";

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

const ParticleComponent = ({ position, args, color, speed, q}) => {
  let particle = new Particle();
  const mesh = useRef(null);
  useFrame(() => {

    let xF = particle.lorentzFx2(0, 0, 1, speed[1], speed[2], q);
    let yF = particle.lorentzFy2(0, 0, 0, speed[2], speed[0], q);
    let zF = particle.lorentzFz2(0, 1, 0, speed[0], speed[1], q);

    speed[0] += xF;
    speed[1] += yF;
    speed[2] += zF;

    mesh.current.position.x += speed[0];
    mesh.current.position.y += speed[1];
    mesh.current.position.z += speed[2];
    return true;
  });

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
      <sphereBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={color} />
    </a.mesh>
  );
};

function App() {
  // useEffect(() => {
  //   const pane = new tweakpane();
  //   const guiData = {
  //     particlesCount: 1,
  //   };

  //   const particlesFolder = pane.addFolder({
  //     title: "Agregar particulas",
  //   });
  //   particlesFolder.addInput(guiData, "particlesCount", {
  //     min: 1,
  //     max: 20,
  //     label: "Cantidad",
  //   });
  //   particlesFolder
  //     .addButton({
  //       title: "Agregar a escena",
  //     })
  //     .on("click", () => {
  //       console.log("Added ", guiData.particlesCount, " particles");
  //     });
  //   return () => {
  //     pane.dispose();
  //   };
  // }, []);
  return (
    <>
      <Canvas colorManagement camera={{ position: [-5, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <pointLight position={[0, -10, 0]} intensity={1.5} />

        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            {/* <shadowMaterial attach="material" opacity={0.3} /> */}
            <meshStandardMaterial attach="material" color="lightgray" />
          </mesh>

          <ParticleComponent
            position={[0, 1, 0]}
            args={[0.2, 100, 100]}
            color="lightblue"
            speed={[0.01, 0.01, 0.01]}
            q={0.01}
          />
          {/* 
          <ParticleComponent
            position={[-2, 1, 2]}
            args={[1, 100, 100]}
            color="pink"
            speed={6}
          />
          <ParticleComponent
            position={[2, 1, -2]}
            args={[1, 100, 100]}
            color="pink"
            speed={6}
          />
          */}
        </group>
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
