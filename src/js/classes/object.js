import * as THREE from "three";

export default class Object {
    constructor(geometry, material){
        this.geometry = geometry;
        this.material = material;
        this.object = new THREE.Mesh(geometry, material);
    }
    setPosition(posX, posY, posZ){
        this.object.position.set(posX, posY, posZ);
    }
}