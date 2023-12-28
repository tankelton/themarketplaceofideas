export function rotateObject(object) {
    if (object) {
        object.rotation.y += 0.1;
    }
}

export function scaleObject(object) {
    if (object) {
        const scaleFactor = 1.1;
        object.scale.x *= scaleFactor;
        object.scale.y *= scaleFactor;
        object.scale.z *= scaleFactor;
    }
}
