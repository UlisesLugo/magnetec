import Object from './object.js';

export default class Particle extends Object {
    constructor(x, y, z, xV, yV, zV, q) {
        super();
        console.log("this is a particle");
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
    }

    lorentzFx(xE, zB, yB){
        return this.q * (xE + (this.yV * zB) - (this.zV * yB));
    }

    lorentzFy(yE, xB, zB){
        return this.q * (yE + (this.zV * xB) - (this.xV * zB));
    }

    lorentzFz(zE, yB, xB){
        return this.q * (zE + (this.xV * yB) - (this.yV * xB));
    }

    lorentzFx2(xE, zB, yB, yV, zV, q){
        return q * (xE + (yV * zB) - (zV * yB));
    }

    lorentzFy2(yE, xB, zB, zV, xV, q){
        return q * (yE + (zV * xB) - (xV * zB));
    }

    lorentzFz2(zE, yB, xB, xV, yV, q){
        return q * (zE + (xV * yB) - (yV * xB));
    }
}