
export default class Vec3d{
    constructor(x, y, z){
        this.vec = [x, y, z];
    }
    dotProd(b){
        let [x1, y1, z1] = this.vec;
        let [x2, y2, z2] = b.vec;
        return x1*x2 + y1*y2 + z1*z2;
    }
    crossProd(b){
        let [x1, y1, z1] = this.vec;
        let [x2, y2, z2] = b.vec;
        return new Vec3d(y1*z2 - z1*y2, z1*x2 - x1*z2, x1*y2 - y1*x2);
    }
    magnitude(){
        let [x1, y1, z1] = this.vec;
        return Math.sqrt(x1*x1 + y1*y1 + z1*z1);
    }
    unit(){
        let [x1, y1, z1] = this.vec;
        let mag = this.magnitude();
        return new Vec3d(x1/mag, y1/mag, z1/mag);
    }
    substract(b){
        let [x1, y1, z1] = this.vec;
        let [x2, y2, z2] = b.vec;
        return new Vec3d(x1-x2, y1-y2, z1-z2);
    }
    add(b){
        let [x1, y1, z1] = this.vec;
        let [x2, y2, z2] = b.vec;
        return new Vec3d(x1+x2, y1+y2, z1+z2);
    }
    mult(k){
        let [x1, y1, z1] = this.vec;
        return new Vec3d(x1*k, y1*k, z1*k);
    }
}