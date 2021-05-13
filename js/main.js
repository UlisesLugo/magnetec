import * as THREE from '/build/three.module.js';
import {OrbitControls} from '/js/jsm/controls/OrbitControls.js';
import Stats from '/js/jsm/libs/stats.module.js';
import * as Mesh from '/js/jsm/libs/mesh.module.js';

"using strict";

let renderer, scene, camera, cameraControl, mesh, stats, plane;
window.anim = false;

function init() {
    // RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    let fov = 60;
    let aspect = window.innerWidth / window.innerHeight;
    let near = 0.1;
    let far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 3, 10);
    cameraControl = new OrbitControls(camera, renderer.domElement);

    // LIGHT
    // POINTLIGHT
    let pointLightColor = "white";
    let intensity = 1;
    let distance = 0;
    let decay = 1;
    let light = new THREE.PointLight(pointLightColor, intensity, distance, decay);
    light.position.set(0, 10, 0);
    let lightHelper = new THREE.PointLightHelper(light, 0.1);
    // AMBIENTLIGHT
    let ambientlight = new THREE.AmbientLight('white', 0.5); // soft white light

    // MODELS
    mesh = new Mesh.Magnet(1);
    mesh.position.y = 1;
    // Plane
    const pgeometry = new THREE.PlaneGeometry(100, 100);
    const pmaterial = new THREE.MeshStandardMaterial( {color: 'blue', side: THREE.DoubleSide} );
    plane = new THREE.Mesh( pgeometry, pmaterial );
    plane.rotateX(Math.PI/2);

    // SCENE GRAPH
    scene.add(mesh);
    //scene.add(box);
    scene.add(plane);
    scene.add(light);
    scene.add(lightHelper);
    scene.add(ambientlight);
            
    // STATS
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // RENDER LOOP
    renderLoop();
}

function renderLoop() {
    stats.begin();
    renderer.render(scene, camera); // DRAW SCENE
    updateScene();
    stats.end();
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateScene() {
    
}

// EVENT LISTENERS & HANDLERS
document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraControl.update();
});