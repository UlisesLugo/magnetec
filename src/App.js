import "./App.scss";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import Particle from "./js/classes/particle.js";
import Magnet from "./js/classes/magnet.js";
import Vec3d from './js/utils/utils.js';
import tweakpane from "tweakpane";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import { useSpring, a } from "react-spring/three";
import { Pane } from "tweakpane";

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

let particles = [];
let magnets = [];

// Creating the particles outside of the component this should be done when creating the particles
let particle = new Particle(0, 1, 0, 0.00, 0.00, 0.00, 0.01);
particles.push(particle);
particle = new Particle(2, 1, 0, 0.00, 0.00, 0.00, 0.01);
particles.push(particle);

const ParticleComponent = ({
  id,
  position,
  args,
  color,
  speed,
  q,
  isPlaying,
}) => {
  /*
  let particle = new Particle(
    position[0],
    position[1],
    position[2],
    speed[0],
    speed[1],
    speed[2],
    q
  );
  particles.push(particle);
  */
  const mesh = useRef(null);
  useFrame(() => {
    if (isPlaying) {

      let xF = particles[id].lorentzFx(0, 0, 0);
      let yF = particles[id].lorentzFy(0, 0, 0);
      let zF = particles[id].lorentzFz(0, 0, 0);

      for (var i = 0; i < particles.length; i++) {
        if (i != id) {
          let ke = 8.988 * Math.pow(10, 9);
          ke = 1/ke;
          let pos1 = new Vec3d(particles[id].x, particles[id].y, particles[id].z);
          let pos2 = new Vec3d(particles[i].x, particles[i].y, particles[i].z);
          
          let c2 = pos1.substract(pos2);
          let mag = c2.magnitude();
          let mag3 = Math.pow(mag, 3);
          
          let force = ke*((particles[id].q * particles[i].q)/mag3);
          let dir = c2.unit();

          speed[0] += force*dir.vec[0]*10000000000;
          speed[1] += force*dir.vec[1]*10000000000;
          speed[2] += force*dir.vec[2]*10000000000;

          console.log(speed[0], speed[1], speed[2]);
        }
      }

      speed[0] += xF;
      speed[1] += yF;
      speed[2] += zF;
    
      particles[id].xV = speed[0];
      particles[id].yV = speed[1];
      particles[id].zV = speed[2];

      mesh.current.position.x += particles[id].xV;
      mesh.current.position.y += particles[id].yV;
      mesh.current.position.z += particles[id].zV;

      particles[id].x = mesh.current.position.x;
      particles[id].y = mesh.current.position.y;
      particles[id].z = mesh.current.position.z;
      // Add force induced by magnets
      for (var i = 0; i < magnets.length; i++){
        let mag = magnets[i];
        let currVelVec = new Vec3d(speed[0], speed[1], speed[2]);
        let forceVec = mag.getForceVectorAtPosition(mesh.current.position.x, mesh.current.position.y, mesh.current.position.z, q, currVelVec);
        // console.log("force vec: ");
        // console.log(forceVec);
      }

    }

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

const MagnetComponent = ({ position, phi, tetha, magnitude, args, color}) => {
  console.log("creating magnet");
  console.log("phi: ", phi);
  console.log("tetha: ", tetha);
  console.log("magnitude: ", magnitude);
  let magnet = new Magnet(phi, tetha, magnitude, position[0], position[1], position[2]);
  console.log(magnet);
  magnets.push(magnet);
  const mesh = useRef(null);
  useFrame(() => {
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
  const pane = new Pane();
  const [guiData, setGuiData] = useState({
    particlesCount: 2,
    playing: false,
  });

  pane.addInput(guiData, "playing").on("change", function (ev) {
    setGuiData({ particlesCount: guiData.particlesCount, playing: ev.value });
  });

  const particlesFolder = pane.addFolder({
    title: "Agregar particulas",
    expanded: false,
  });
  particlesFolder.addInput(guiData, "particlesCount", {
    min: 1,
    max: 20,
    step: 1,
    label: "Cantidad",
  });
  particlesFolder
    .addButton({
      title: "Agregar a escena",
    })
    .on("click", () => {
      console.log("Added ", guiData.particlesCount, " particles");
    });
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
            id={0}
            position={[0, 1, 0]}
            args={[0.2, 100, 100]}
            color="lightblue"
            speed={[0.00, 0.00, 0.00]}
            q={0.01}
            isPlaying={guiData.playing}
          />
          <ParticleComponent
            id={1}
            position={[2, 2, 1]}
            args={[0.2, 100, 100]}
            color="red"
            speed={[0.00, 0.00, 0.00]}
            q={0.02}
            isPlaying={guiData.playing}
          />

          <MagnetComponent
            phi={Math.PI}
            tetha={Math.PI} 
            magnitude={1000}
            position={[1, 2, 1]}
            args={[0.2, 100, 100]}
            color="black"
          />
          {/* 
          <ParticleComponent
            position={[-2, 1, 2]}
            args={[1, 20, 20]}
            color="pink"
            speed={6}
          />
          
          <ParticleComponent
            position={[2, 1, -2]}
            args={[1, 20, 20]}
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
