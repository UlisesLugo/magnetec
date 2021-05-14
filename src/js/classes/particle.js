import Object from './object.js';

export default class Particle extends Object {

    constructor(geometry, material) {
        super(geometry, material);
        console.log("this is a particle");
        this.xF = 0.0;
        this.yF = -0.1;
        this.zF = 0.0;
    }
}