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
    const geometry = new THREE.SphereGeometry(1, 100, 100);
    const material = new THREE.MeshBasicMaterial({color: "gray", wireframe: false, side: THREE.DoubleSide});
    let obj = new Particle(geometry, material);
    let mesh = obj.object;
    scene.add(mesh);
    ///////////////////////////////

    camera.position.z = 5;
    let animate = function () {
      requestAnimationFrame(animate);
      //cube.rotation.x += 0.01;
      //cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    // EVENT LISTENERS & HANDLERS
    console.log("Aqui");
  }, []);
  return <div className="App"></div>;
}

export default App;
