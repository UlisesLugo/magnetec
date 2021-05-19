import logo from "./logo.svg";
import "./App.css";
import * as THREE from "three";
import { useEffect } from "react";
import Particle from "./js/classes/particle.js";

function App() {
  useEffect(() => {
    let cameraControl;
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
    document.body.appendChild(renderer.domElement);
    //let geometry = new THREE.SphereGeometry(1);
    //let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //let cube = new THREE.Mesh(geometry, material);
    //scene.add(cube);

    /////// TEST PARTICLE /////////
    const geometry = new THREE.SphereGeometry(0.1, 100, 100);
    const material = new THREE.MeshBasicMaterial({color: "gray", wireframe: false, side: THREE.DoubleSide});
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
          (particle.getXPosition() + particle.xV), 
          (particle.getYPosition() + particle.yV), 
          (particle.getZPosition() + particle.zV)); 
      
      renderer.render(scene, camera);
    };
    animate();
    // EVENT LISTENERS & HANDLERS
    console.log("Aqui");
  }, []);
  return <div className="App"></div>;
}

export default App;
