// Define variables
let scene, camera, renderer;
let orbit, orbitControls;
let altitudeInput;

// Initialize function
function init() {
    // Initialize scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('orbitVisualization').appendChild(renderer.domElement);

    // Create orbit
    let orbitRadius = 100;
    let orbitSegments = 64;
    let orbitGeometry = new THREE.CircleGeometry(orbitRadius, orbitSegments);
    let orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbit);

    // Initialize orbit controls
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    // Initialize input controls
    altitudeInput = document.getElementById('altitude');
    altitudeInput.addEventListener('input', updateAltitude);

    // Set initial camera position
    camera.position.set(0, 0, 200);
}

// Update altitude function
function updateAltitude() {
    let altitude = parseInt(altitudeInput.value);
    // Update orbit position based on altitude
    orbit.position.set(0, altitude, 0);
}

// Render function
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// Initialize and render
init();
render();
