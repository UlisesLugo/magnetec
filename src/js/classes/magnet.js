import Vec3d from "../utils/utils.js";
import Object from "./object.js";

const U_NOT = 4 * Math.PI * 1e-7; // H/m.

class MagneticMomentVector {
  // scheme: https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/3D_Spherical.svg/1200px-3D_Spherical.svg.png
  constructor(phi, tetha, magnitude, x, y, z) {
    this.setPhiTethaMagnitude(phi, tetha, magnitude);
    this.setStartPosition(x, y, z);
  }

  setStartPosition(x, y, z) {
    this.startPos = new Vec3d(x, y, z);
  }

  setPhiTethaMagnitude(phi, tetha, magnitude) {
    this.phi = phi;
    this.tetha = tetha;
    this.magnitude = magnitude;
  }

  getVectorEndPosition() {
    let x = this.magnitude * Math.cos(this.tetha) * Math.sin(this.phi);
    let y = this.magnitude * Math.sin(this.tetha) * Math.sin(this.phi);
    let z = this.magnitude * Math.cos(this.phi);
    // update end of vector since spherical coordinates are relative to the start of it
    let end_pos = new Vec3d(x, y, z).add(this.startPos);
    return end_pos;
  }

  magneticFieldAtP(x, y, z) {
    // let r = (new Vec3d(x, y, z)).substract(this.startPos);
    let r = new Vec3d(x, y, z).substract(this.startPos);
    let m = this.getVectorEndPosition().substract(this.startPos);

    let scalar = (U_NOT / (4 * Math.PI)) * (1 / Math.pow(r.magnitude(), 3));
    let magnetic = r
      .unit()
      .mult(3 * m.dotProd(r.unit()))
      .substract(m);
    magnetic = magnetic.mult(scalar);
    return magnetic;
  }

  magneticForceAtCharge(x, y, z, q, vel) {
    // vel must be a Vec3d
    let magnetic = this.magneticFieldAtP(x, y, z);
    return vel.mult(q).crossProd(magnetic);
  }
}

export default class Magnet extends Object {
  constructor(phi, tetha, magnitude, x, y, z, isSelected) {
    let geometry = 5; //new new THREE.SphereGeometry(0.1, 100, 100);
    let material = 5; //new THREE.MeshPhongMaterial({color: "red"});
    super(geometry, material);
    this.magneticMomentVector = new MagneticMomentVector(
      phi,
      tetha,
      magnitude,
      x,
      y,
      z
    );
    this.setPosition(x, y, z);
    this.isSelected = isSelected;
  }

  setPhiTethaMagnitude(phi, tetha, magnitude) {
    this.magneticMomentVector.setPhiTethaMagnitude(phi, tetha, magnitude);
  }
  setPosition(x, y, z) {
    // We have to set the position here
    // super(); // or something
    this.magneticMomentVector.setStartPosition(x, y, z);
  }

  getForceVectorAtPosition(x, y, z, q, vel) {
    return this.magneticMomentVector.magneticForceAtCharge(x, y, z, q, vel);
  }
}
