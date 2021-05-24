import {Vec3d} from '../utils/utils';

const U_NOT = 4 * Math.PI * 1e-7;

class MagneticMomentVector{
    // scheme: https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/3D_Spherical.svg/1200px-3D_Spherical.svg.png
    constructor(phi, tetha, magnitude, x, y, z){
        this.setPhiTethaMagnitude(phi, tetha, magnitude);
        this.setStartPosition(x, y, z);
    }

    setStartPosition(x, y, z){
        this.startPos = new Vec3d(x, y, z);
    }
    setPhiTethaMagnitude(phi, tetha, magnitude){
        this.phi = phi; 
        this.tetha = tetha;
        this.magnitude = magnitude;
    }
    
    getVectorEndPosition(){
        let x = this.magnitude * Math.cos(this.tetha) * Math.sin(this.phi);
        let y = this.magnitude * Math.sin(this.tetha) * Math.sin(this.phi);
        let z = this.magnitude * Math.cos(this.tetha);
        return new Vec3d(x, y, z);
    }

    magneticFieldAtP(x, y, z){
        let r = (new Vec3d(x, y, z)).substract(this.startPos);
        let m = this.getVectorPointPosition()
        
        let scalar = U_NOT/(4*Math.PI) * 1 / Math.pow(r.magnitude(), 3);
        let magnetic = r.unit().mult(3*m.dotProd(r.unit())).substract(m);
        magnetic = magnetic.mult(scalar);
        return magnetic;
    }

    magneticForceAtCharge(x, y, z, q, vel){ // vel must be a Vec3d
        magnetic = this.magneticFieldAtP(x, y, z);
        return vel.mult(q).crossProd(magnetic);
    }
}

class Magnet extends Object {
    constructor(phi, tetha, magnitude, x, y, z){
        let geometry = new new THREE.SphereGeometry(0.1, 100, 100);
        let material = new THREE.MeshPhongMaterial({color: "red"});
        super(geometry, material);
        this.magneticMomentVector = MagneticMomentVector(phi, tetha, magnitude, x, y, z);
        this.setPosition(x, y, z);
    }

    setPhiTethaMagnitude(phi, tetha, magnitude){
        this.magneticMomentVector.setPhiTethaMagnitude(phi, tetha, magnitude);
    }
    setPosition(x, y, z){
        super(); // or something
        this.magneticMomentVector.setStartPosition(x, y, z);
    }

    getForceVectorAtPosition(x, y, z, q, vel){
        return this.magneticMomentVector.magneticForceAtCharge(x, y, z, q, vel);
    }


}