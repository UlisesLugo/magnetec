class MagneticMomentVector{
    constructor(phi, tetha, magnitude){
        setPhiTethaMagnitude(phi, tetha, magnitude);
    }

    setPhiTethaMagnitude(phi, tetha, magnitude){
        this.phi = phi; 
        this.tetha = tetha;
        this.magnitude = magnitude;
    }
}

class Magnet extends Object {
    constructor(phi, tetha, magnitude){
        let geometry = new THREE.BoxGeometry(1);
        let material = new THREE.MeshPhongMaterial({color: "red"});
        super(geometry, material);
        this.magneticMomentVector = MagneticMomentVector(phi, tetha, magnitude);
        this.setPosition(0, 0, 0);
    }

    setPhiTethaMagnitude(phi, tetha, magnitude){
        this.magneticMomentVector.setPhiTethaMagnitude(phi, tetha, magnitude);
    }

    getForceVectorAtPosition(posX, posY, posZ){
        fx = posX;
        fy = posY;
        fz = posZ;
        return posZ;
    }
}