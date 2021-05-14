import Object from './object.js';

export default class Particle extends Object {
    constructor(geometry, material) {
        super(geometry, material);
        console.log("this is a particle");
    }

}