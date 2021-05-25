import Object from './object.js';

export default class Particle extends Object {
    constructor(geometry, material) {
        super(geometry, material);
        console.log("this is a particle");
        this.xF = 0.0; // Force in x
        this.yF = 0.0; // Force in y
        this.zF = 0.0; // Force in z
        this.xV = 0.1; // Velocity in x
        this.yV = 0.0; // Velocity in y
        this.zV = 0.0; // Velocity in z
        this.q = 0.01; // Particle charge
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