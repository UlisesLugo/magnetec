import "./App.scss";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import Particle from "./js/classes/particle.js";
import Magnet from "./js/classes/magnet.js";
import Vec3d from "./js/utils/utils.js";
import tweakpane from "tweakpane";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import { useSpring, a } from "react-spring/three";
import { Pane } from "tweakpane";

let print_i = 0;
let count_particles = 0;

const ParticleComponent = ({
  id,
  position,
  args,
  color,
  //speed,
  q,
  particles,
  magnets,
  epochParticles,
  setEpochParticles,
  guiData,
}) => {
  const mesh = useRef(null);
  useFrame(() => {
    particles[id].mesh = mesh;
    if (guiData.playing) {
      console.log("isPlaying");

      // Get force applied to the particle with lorentz function for a constant field
      let xF = particles[id].lorentzFx(0, 0, 0);
      let yF = particles[id].lorentzFy(0, 0, 0);
      let zF = particles[id].lorentzFz(0, 0, 0);

      // Add force induced by magnets
      for (var i = 0; i < Object.keys(magnets).length; i++) {
        let mag = magnets[i];
        let currVelVec = new Vec3d(
          particles[id].xV,
          particles[id].yV,
          particles[id].zV
        );
        let forceVec = mag.getForceVectorAtPosition(
          mesh.current.position.x,
          mesh.current.position.y,
          mesh.current.position.z,
          particles[id].q,
          currVelVec
        );

        // Get force applied to the particle with lorentz function
        xF += forceVec.vec[0] * 1e7;
        yF += forceVec.vec[1] * 1e7;
        zF += forceVec.vec[2] * 1e7;

        console.log(
          "force vec x: ",
          forceVec.vec[0],
          " y: ",
          forceVec.vec[1],
          " z: ",
          forceVec.vec[2]
        );
      }

      for (var i = 0; i < Object.keys(particles).length; i++) {
        if (i != id) {
          let force = particles[id].getForceVectorAtP(particles[i]);
          // Repulsion multiplied because the force is to little to be noticable

          xF += force.vec[0] * 1e8;
          yF += force.vec[1] * 1e8;
          zF += force.vec[2] * 1e8;
          if (print_i % 30 == 0 || print_i % 30 == 1)
            console.log(
              "force in particle ",
              id,
              force.vec[0] * 1e11,
              force.vec[1] * 1e11,
              force.vec[2] * 1e11
            );
          print_i++;
        }
      }

      // Update Object speed
      particles[id].xV += xF;
      particles[id].yV += yF;
      particles[id].zV += zF;

      // Update Component position
      mesh.current.position.x += particles[id].xV;
      mesh.current.position.y += particles[id].yV;
      mesh.current.position.z += particles[id].zV;

      count_particles++;
      if (count_particles == Object.keys(particles).length) {
        count_particles = 0;
        for (let i = 0; i < Object.keys(particles).length; i++) {
          particles[i].x = particles[i].mesh.current.position.x;
          particles[i].y = particles[i].mesh.current.position.y;
          particles[i].z = particles[i].mesh.current.position.z;
        }
      }
    }

    return true;
  });

  const [expand, setExpand] = useState(false);

  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });

  const handleClick = () => {
    setExpand(!expand);
    console.log("Selected particle #", id);
  };

  return (
    <a.mesh
      onClick={handleClick}
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

const MagnetComponent = ({ id, position, args, color }) => {
  const mesh = useRef(null);
  useFrame(() => {});

  const [expand, setExpand] = useState(false);

  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });

  const handleClick = () => {
    setExpand(!expand);
    console.log("Selected magnet #", id);
  };

  return (
    <a.mesh
      onClick={handleClick}
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
    selectedPosX: 0,
    selectedPosY: 0,
    selectedPosZ: 0,
  });
  const [particles, setParticles] = useState();
  const [magnets, setMagnets] = useState();
  const [epochParticles, setepochParticles] = useState(0);

  useEffect(() => {
    let particle1 = new Particle(1, 0, 0, -0.001, 0, 0, -0.1, false);
    let particle2 = new Particle(-1, 0, 0, 0.001, 0, 0, 0.1, false);
    setParticles({ 0: particle1, 1: particle2 });

    let magnet = new Magnet(Math.PI / 2, Math.PI / 2, 10, 0, -5, 0);
    setMagnets({ 0: magnet });
  }, []);
  // Creating the particles outside of the component this should be done when creating the particles

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
            position={[1, 0, 0]}
            args={[0.2, 100, 100]}
            color="lightblue"
            // speed={[0.00, 0.00, 0.00]}
            q={0.01}
            particles={particles}
            magnets={magnets}
            epochParticles={epochParticles}
            setEpochParticles={setepochParticles}
            guiData={guiData}
          />
          <ParticleComponent
            id={1}
            position={[-1, 0, 0]}
            args={[0.2, 100, 100]}
            color="red"
            // speed={[0.00, 0.00, 0.00]}
            q={0.01}
            particles={particles}
            magnets={magnets}
            epochParticles={epochParticles}
            setEpochParticles={setepochParticles}
            guiData={guiData}
          />

          <MagnetComponent
            id={0}
            position={[0, -5, 0]}
            args={[0.2, 100, 100]}
            color="black"
          />
        </group>
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
