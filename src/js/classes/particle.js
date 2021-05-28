import Vec3d from "../utils/utils.js";
import Object from "./object.js";

const KE = 1 / (8.988 * Math.pow(10, 9));
export default class Particle extends Object {
  constructor(x, y, z, xV, yV, zV, q, isSelected) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
    this.xF = 0.0; // Force in x
    this.yF = 0.0; // Force in y
    this.zF = 0.0; // Force in z
    this.xV = xV; // Velocity in x
    this.yV = yV; // Velocity in y
    this.zV = zV; // Velocity in z
    this.q = q; // Particle charge
    this.mass = 1; // Particle mass (useless at the moment)
    this.isSelected = isSelected;
  }

  lorentzFx(xE, zB, yB) {
    return this.q * (xE + this.yV * zB - this.zV * yB);
  }

  lorentzFy(yE, xB, zB) {
    return this.q * (yE + this.zV * xB - this.xV * zB);
  }

  lorentzFz(zE, yB, xB) {
    return this.q * (zE + this.xV * yB - this.yV * xB);
  }

  getForceVectorAtP(otherP) {
    let pos1 = new Vec3d(this.x, this.y, this.z);
    let pos2 = new Vec3d(otherP.x, otherP.y, otherP.z);

    let c2 = pos1.substract(pos2);
    let mag = c2.magnitude();
    let mag3 = Math.pow(mag, 3);

    let force = KE * ((this.q * otherP.q) / mag3);
    let dir = c2.unit();

    return dir.mult(force);
  }
}
