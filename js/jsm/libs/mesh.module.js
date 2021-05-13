import * as THREE from '/build/three.module.js';

class Mesh extends THREE.Mesh {
    constructor() {
        super();
    }
    setWireframe(value) {
        this.material.wireframe = value;
    }
}

class Magnet extends Mesh {
    constructor(radius) {
        super();
        // QUAD
        this.geometry = new THREE.SphereGeometry(radius, 100, 100);
        this.material = new THREE.MeshStandardMaterial({color: "gray", wireframe: false, side: THREE.DoubleSide});
    }
}

export {Magnet};