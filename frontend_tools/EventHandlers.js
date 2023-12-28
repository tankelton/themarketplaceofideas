



export function setupEventHandlers(scene, camera, onSelectObject) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Function to update the mouse position
    function updateMousePosition(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    // Function to handle mouse click events for selecting objects
    function onMouseClick(event) {
        updateMousePosition(event);
        raycaster.setFromCamera(mouse, camera);

        // Determine which objects are intersected by the ray
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            onSelectObject(selectedObject);
        } else {
            onSelectObject(null); // Deselect if clicked on empty space
        }
    }

    document.addEventListener('click', onMouseClick, false);
}

