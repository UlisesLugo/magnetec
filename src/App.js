import "./App.scss";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import Particle from "./js/classes/particle.js";
import Magnet from "./js/classes/magnet.js";
import Vec3d from "./js/utils/utils.js";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import { useSpring, a } from "react-spring/three";
import { Pane } from "tweakpane";

let print_i = 0;
let count_particles = 0;
const PART_RAD = 0.2;

const ParticleComponent = ({
  id,
  position,
  args,
  color,
  particles,
  magnets,
  guiData,
  setGuiData,
}) => {
  const mesh = useRef(null);
  useFrame(() => {
    particles[id].mesh = mesh;
    if (guiData.playing) {
      // Get force applied to the particle with lorentz function for a constant field
      let xF = 0;
      let yF = 0;
      let zF = 0;

      // Add force induced by magnets
      for (let i = 0; i < magnets.length; i++) {
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

        xF += forceVec.vec[0];
        yF += forceVec.vec[1];
        zF += forceVec.vec[2];
      }

      for (let i = 0; i < particles.length; i++) {
        if (i != id) {
          let dist = new Vec3d(
            particles[id].x - particles[i].x,
            particles[id].y - particles[i].y,
            particles[id].z - particles[i].z).magnitude();
          if (dist <= PART_RAD*2){
            particles[id].xV = 0;
            particles[id].yV = 0;
            particles[id].zV = 0;
            continue;
          }
          let force = particles[id].getForceVectorAtP(particles[i]);
          xF += force.vec[0];
          yF += force.vec[1];
          zF += force.vec[2];
        }
      }
      print_i++;

      // Update Object speed
      particles[id].xV = particles[id].xV * 0.9 + xF;
      particles[id].yV = particles[id].yV * 0.9 + yF;
      particles[id].zV = particles[id].zV * 0.9 + zF;

      let speedVec = new Vec3d(particles[id].xV, particles[id].yV, particles[id].zV);
      if (speedVec.magnitude() > PART_RAD/2){
        speedVec = speedVec.unit().mult(PART_RAD/2);
        particles[id].xV = speedVec.vec[0];
        particles[id].yV = speedVec.vec[1];
        particles[id].zV = speedVec.vec[2];
      }

      // Update Component position
      mesh.current.position.x += particles[id].xV;
      mesh.current.position.y += particles[id].yV;
      mesh.current.position.z += particles[id].zV;

      count_particles++;
      if (count_particles == particles.length) {
        count_particles = 0;
        for (let i = 0; i < particles.length; i++) {
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
    if (!particles[id].isSelected) {
      for (let i = 0; i < Object.keys(particles).length; i++) {
        particles[i].isSelected = false;
      }
      particles[id].isSelected = true;
      console.log("Selected particle #", id);
      setGuiData((prevState) => ({
        ...prevState,
        currParticleX: particles[id].x,
        currParticleY: particles[id].y,
        currParticleZ: particles[id].z,
        currParticleQ: particles[id].q,
        currParticleId: id,
      }));
    } else {
      console.log("Unselected id #", id);
      particles[id].isSelected = false;
    }
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

const MagnetComponent = ({
  id,
  position,
  args,
  color,
  magnets,
  setGuiData,
}) => {
  const mesh = useRef(null);
  useFrame(() => {});

  const [expand, setExpand] = useState(false);

  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });

  const handleClick = () => {
    setExpand(!expand);
    if (!magnets[id].isSelected) {
      for (let i = 0; i < magnets.length; i++) {
        magnets[i].isSelected = false;
      }
      magnets[id].isSelected = true;
      console.log("Selected particle #", magnets[id]);
      setGuiData((prevState) => ({
        ...prevState,
        currMagnetX: magnets[id].magneticMomentVector.startPos.vec[0],
        currMagnetY: magnets[id].magneticMomentVector.startPos.vec[1],
        currMagnetZ: magnets[id].magneticMomentVector.startPos.vec[2],
        currMagnetPhi: magnets[id].magneticMomentVector.phi,
        currMagnetTetha: magnets[id].magneticMomentVector.tetha,
        currMagnetMagnitude: magnets[id].magneticMomentVector.magnitude,
        currMagnetId: id,
      }));
    } else {
      console.log("Unselected id #", id);
      magnets[id].isSelected = false;
    }
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

const ParticlesList = ({ particles, guiData, setGuiData, magnets }) => {
  return particles?.map((particle, index) => (
    <ParticleComponent
      key={index}
      id={index}
      position={[particle.x, particle.y, particle.z]}
      args={[0.2, 100, 100]}
      color="lightblue"
      // speed={[0.00, 0.00, 0.00]}
      q={particle.q}
      particles={particles}
      magnets={magnets}
      guiData={guiData}
      setGuiData={setGuiData}
    />
  ));
};

const MagnetsList = ({ magnets, setGuiData }) => {
  return magnets?.map((magnet, index) => {
    let x = magnet.magneticMomentVector.startPos.vec[0];
    let y = magnet.magneticMomentVector.startPos.vec[1];
    let z = magnet.magneticMomentVector.startPos.vec[2];
    return (
      <MagnetComponent
        id={index}
        position={[x, y, z]}
        args={[0.2, 100, 100]}
        color="black"
        magnets={magnets}
        setGuiData={setGuiData}
      />
    );
  });
};

function App() {
  const pane = new Pane();
  const [guiData, setGuiData] = useState({
    particlesCount: 2,
    magnetsCount: 1,
    playing: false,
    currParticleX: 0,
    currParticleY: 0,
    currParticleZ: 0,
    currParticleQ: 0.1,
    currParticleId: -1,
    currMagnetX: 0,
    currMagnetY: 0,
    currMagnetZ: 0,
    currMagnetPhi: 0.1,
    currMagnetTetha: 0.1,
    currMagnetMagnitude: 0.1,
    currMagnetId: -1,
  });
  const [particles, setParticles] = useState();
  const [magnets, setMagnets] = useState();

  useEffect(() => {
    let parts = []
    for (let i = 0; i < 5; i++){
      let charge = 0.3*1e-9;
      if (Math.random() >= 0.5) charge*=-1;
      parts.push(new Particle(Math.random()*3-1.5, Math.random()*3-1.5, Math.random()*3-1.5, 0, 0, 0, charge, false));
    }
    // let particle1 = new Particle(2, 0, 0, 0, 0, 0, -0.5*1e-9, false);
    // let particle2 = new Particle(-2, 0, 0, 0, 0, 0, 0.5*1e-9, false);
    // parts = [particle1, particle2];
    // let particle3 = new Particle(1, 0, 2, 0, 0, 0, 0.5*1e-12, false);
    setParticles(parts);

    let mags = []
    // for (let i = 0; i < 50; i++){
    //   mags.push(new Magnet(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, 0.01, Math.random()*20-10,  Math.random()*20-10, Math.random()*20-10));
    // }

    let magnet = new Magnet(Math.PI / 2, Math.PI / 2, 0.03, 0, 0, 0);
    mags.push(magnet);
    // let magnet2 = new Magnet(Math.PI / 2, Math.PI / 2, 0.01, 1, 2, 3);
    // mags.push(magnet2);
    setMagnets(mags);
  }, []);
  // Creating the particles outside of the component this should be done when creating the particles

  pane.addInput(guiData, "playing").on("change", function (ev) {
    setGuiData({ ...guiData, playing: ev.value });
  });

  const particlesSection = pane.addFolder({
    title: "Particulas",
    expanded: true,
  });
  const particlesFolder = particlesSection.addFolder({
    title: "Agregar particulas",
    expanded: true,
  });
  particlesFolder
    .addButton({
      title: "Agregar una particula",
    })
    .on("click", () => {
      // TODO Check random attributes
      const new_particle = new Particle(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        -0.001,
        0,
        0,
        0.01,
        false
      );
      setParticles([...particles, new_particle]);
      console.log("Added ", guiData.particlesCount, " particles");
      setGuiData({ ...guiData, particlesCount: guiData.particlesCount + 1 });
    });
  const selectedParticleFolder = particlesSection.addFolder({
    title: "Editar Particula Seleccionada",
    expanded: true,
  });
  selectedParticleFolder
    .addInput(guiData, "currParticleX", {
      min: -50,
      max: 50,
      label: "PosX",
    })
    .on("change", (ev) => {
      setParticles((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currParticleId) {
            value.x = ev.value;
          }
          return value;
        });
      });
    });
  selectedParticleFolder
    .addInput(guiData, "currParticleY", {
      min: -50,
      max: 50,
      label: "PosY",
    })
    .on("change", (ev) => {
      setParticles((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currParticleId) {
            value.y = ev.value;
          }
          return value;
        });
      });
    });
  selectedParticleFolder
    .addInput(guiData, "currParticleZ", {
      min: -50,
      max: 50,
      label: "PosZ",
    })
    .on("change", (ev) => {
      setParticles((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currParticleId) {
            value.z = ev.value;
          }
          return value;
        });
      });
    });
  selectedParticleFolder
    .addInput(guiData, "currParticleQ", {
      min: -0.1,
      max: 0.1,
      label: "Carga (microcoulombs)",
      step: 0.001,
    })
    .on("change", (ev) => {
      setParticles((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currParticleId) {
            value.q = ev.value;
          }
          return value;
        });
      });
    });

  ////////////////////////////////////////
  // GUI MAGNET SECTION
  ////////////////////////////////////////
  const magnetSection = pane.addFolder({
    title: "Imanes",
    expanded: true,
  });
  const magnetsFolder = magnetSection.addFolder({
    title: "Agregar imanes",
    expanded: true,
  });
  magnetsFolder
    .addButton({
      title: "Agregar un imán",
    })
    .on("click", () => {
      // TODO Check random attributes
      const new_magnet = new Magnet(
        Math.PI / 2,
        Math.PI / 2,
        10,
        Math.random() * 6 - 3,
        Math.random() * 6 - 3,
        Math.random() * 6 - 3,
        false
      );
      setMagnets([...magnets, new_magnet]);
      setGuiData({ ...guiData, magnetsCount: guiData.magnetsCount + 1 });
    });
  const selectedMagnetFolder = magnetSection.addFolder({
    title: "Editar Imán Seleccionada",
    expanded: true,
  });
  selectedMagnetFolder
    .addInput(guiData, "currMagnetX", {
      min: -50,
      max: 50,
      label: "PosX",
    })
    .on("change", (ev) => {
      setMagnets((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currMagnetId) {
            value.magneticMomentVector.startPos.vec[0] = ev.value;
          }
          return value;
        });
      });
    });
  selectedMagnetFolder
    .addInput(guiData, "currMagnetY", {
      min: -50,
      max: 50,
      label: "PosY",
    })
    .on("change", (ev) => {
      setMagnets((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currMagnetId) {
            value.magneticMomentVector.startPos.vec[1] = ev.value;
          }
          return value;
        });
      });
    });
  selectedMagnetFolder
    .addInput(guiData, "currMagnetZ", {
      min: -50,
      max: 50,
      label: "PosZ",
    })
    .on("change", (ev) => {
      setMagnets((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currMagnetId) {
            value.magneticMomentVector.startPos.vec[2] = ev.value;
          }
          return value;
        });
      });
    });
  selectedMagnetFolder
    .addInput(guiData, "currMagnetPhi", {
      min: 0,
      max: Math.PI * 2,
      label: "Phi",
      step: 0.1,
    })
    .on("change", (ev) => {
      setMagnets((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currMagnetId) {
            value.magneticMomentVector.phi = ev.value;
          }
          return value;
        });
      });
    });
  selectedMagnetFolder
    .addInput(guiData, "currMagnetTetha", {
      min: 0,
      max: Math.PI * 2,
      label: "Tetha",
      step: 0.1,
    })
    .on("change", (ev) => {
      setMagnets((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currMagnetId) {
            value.magneticMomentVector.tetha = ev.value;
          }
          return value;
        });
      });
    });
  selectedMagnetFolder
    .addInput(guiData, "currMagnetMagnitude", {
      min: 0,
      max: 0.05,
      label: "Magnitud",
      step: 0.001,
    })
    .on("change", (ev) => {
      setMagnets((prevState) => {
        return prevState.map((value, key) => {
          if (key === guiData.currMagnetId) {
            value.magneticMomentVector.magnitude = ev.value;
          }
          return value;
        });
      });
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

          <ParticlesList
            guiData={guiData}
            magnets={magnets}
            particles={particles}
            setGuiData={setGuiData}
          />

          <MagnetsList magnets={magnets} setGuiData={setGuiData} />
        </group>
        <OrbitControls />
        <axesHelper />
      </Canvas>
    </>
  );
}

export default App;
