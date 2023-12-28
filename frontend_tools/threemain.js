
import { initializeScene } from './SceneSetup.js';
import { createCube, createSphere, createCylinder } from './PrimitiveCreation.js';
import { setupEventHandlers } from './EventHandlers.js';

// Initialize the scene, camera, and renderer
const { scene, camera, renderer } = initializeScene();
document.getElementById('editor-container').appendChild(renderer.domElement);

let rightClickPosition = { x: 0, y: 0 };
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();



let selectedObject = null;

function onSelectObject(object) {
    if (selectedObject) {
        // Reset the previous selected object's material
        if (selectedObject.material && selectedObject.material.emissive) {
            selectedObject.material.emissive.setHex(selectedObject.originalEmissive || 0x000000);
        }
    }

    selectedObject = object;

    if (selectedObject && selectedObject.material && selectedObject.material.emissive) {
        // Save the original emissive color
        selectedObject.originalEmissive = selectedObject.material.emissive.getHex();
        // Set a new emissive color to highlight the object
        selectedObject.material.emissive.setHex(0xff0000);
    }
}

setupEventHandlers(scene, camera, onSelectObject);




setupEventHandlers(scene, camera, onSelectObject);

// Function to add a primitive object at the mouse position
function addPrimitiveAtMousePosition(primitive, position) {
    mouse.x = (position.x / window.innerWidth) * 2 - 1;
    mouse.y = - (position.y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;
        primitive.position.copy(intersectPoint);
        scene.add(primitive);
    }
}

// Context menu display logic
function showContextMenu(x, y) {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = 'block';
}

function hideContextMenu() {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'none';
}

// Right-click event listener to show the context menu
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    rightClickPosition.x = event.clientX;
    rightClickPosition.y = event.clientY;
    showContextMenu(event.clientX, event.clientY);
});

// Event listeners for context menu items
document.getElementById('addCube').addEventListener('click', () => {
    addPrimitiveAtMousePosition(createCube(), rightClickPosition);
    hideContextMenu();
});

document.getElementById('addSphere').addEventListener('click', () => {
    addPrimitiveAtMousePosition(createSphere(), rightClickPosition);
    hideContextMenu();
});

document.getElementById('addCylinder').addEventListener('click', () => {
    addPrimitiveAtMousePosition(createCylinder(), rightClickPosition);
    hideContextMenu();
});

// Hide the context menu when clicking elsewhere
document.addEventListener('click', hideContextMenu);

// Setup additional event handlers (if any)
setupEventHandlers(scene, camera, renderer, addPrimitiveAtMousePosition);

// Animation loop to render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
