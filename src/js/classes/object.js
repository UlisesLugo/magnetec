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
    getXPosition(){
        return this.object.position.x;
    }
    getYPosition(){
        return this.object.position.y;
    }
    getZPosition(){
        return this.object.position.z;
    }
}