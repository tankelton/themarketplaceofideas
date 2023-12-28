


export function createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
    return new THREE.Mesh(geometry, material);
}

export function createSphere() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
    return new THREE.Mesh(geometry, material);
}

export function createCylinder() {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
    return new THREE.Mesh(geometry, material);
}


// Add more functions as needed for other primitives
