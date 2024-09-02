import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const minimapCanvas = document.getElementById('minimap');
const minimapContext = minimapCanvas.getContext('2d');

function createSquare() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const square = new THREE.Mesh(geometry, material);

    square.position.x = Math.random() * 100 - 50;
    square.position.z = Math.random() * 100 - 50;
    square.position.y = 0.5;

    scene.add(square);

    return square;
}

const squares = [];
for (let i = 0; i < 50; i++) {
    squares.push(createSquare());
}

const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => {
    controls.lock();
});

const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            keys.forward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.backward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            keys.forward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.backward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = false;
            break;
    }
});

function updateMinimap() {
    minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);

    const centerX = minimapCanvas.width / 2;
    const centerZ = minimapCanvas.height / 2;

    squares.forEach(square => {
        const relativeX = square.position.x - camera.position.x;
        const relativeZ = square.position.z - camera.position.z;

        const x = (relativeX / 100) * minimapCanvas.width + centerX;
        const z = (relativeZ / 100) * minimapCanvas.height + centerZ;

        minimapContext.fillStyle = '#ff0000';
        minimapContext.fillRect(x - 2, z - 2, 4, 4);
    });

    minimapContext.fillStyle = '#00ff00';
    minimapContext.beginPath();
    minimapContext.arc(centerX, centerZ, 5, 0, 2 * Math.PI);
    minimapContext.fill();
}


function animate() {
    requestAnimationFrame(animate);

    if (keys.forward) controls.moveForward(0.1);
    if (keys.backward) controls.moveForward(-0.1);
    if (keys.left) controls.moveRight(-0.1);
    if (keys.right) controls.moveRight(0.1);

    squares.forEach(square => {
        square.rotation.x += 0.01;
        square.rotation.y += 0.01;
    });

    controls.update();
    renderer.render(scene, camera);

    updateMinimap();
}

animate();

camera.position.y = 1;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
