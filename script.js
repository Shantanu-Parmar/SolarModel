let scene, camera, renderer;
let planets = [];
let asteroids = [];
let stars = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('orbitVisualization').appendChild(renderer.domElement);

    createStarfield();
    createPlanets();
    createAsteroids();
    setupLights();
    
    animate();
// Add event listener for the switch view button
    document.getElementById('switchViewButton').addEventListener('click', switchView);
    document.addEventListener('click', toggleControlsPanel);
    document.getElementById('zoomInButton').addEventListener('click', zoomIn);
    document.getElementById('zoomOutButton').addEventListener('click', zoomOut);
    window.addEventListener('wheel', zoomWithMouseWheel);
}
function switchView() {
    // Set camera position to look from the top of the sun
    camera.position.set(0, 100, 0); // Adjust the values as needed
    camera.lookAt(scene.position);
}
function createStarfield() {
    for (let i = 0; i < 50999; i++) {
        let starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        let starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        let star = new THREE.Mesh(starGeometry, starMaterial);

        star.position.x = Math.random() * 1000 - 500;
        star.position.y = Math.random() * 1000 - 500;
        star.position.z = -Math.random() * 2000;

        stars.push(star);
        scene.add(star);
    }
}

function createPlanets() {
    let planetsData = [
        { name: "Mercury", radius: 4880, texture: 'mercury.png', speed: 1 },
        { name: "Venus", radius: 12104, texture: 'venus.png', speed: 0.1 },
        { name: "Earth", radius: 12756, texture: 'earth.png', speed: 0.1 },
        { name: "Mars", radius: 6792, texture: 'mars.png', speed: 0.1 },
        { name: "Jupiter", radius: 142984, texture: 'jupiter.png', speed: 0.1 },
        { name: "Saturn", radius: 120536, texture: 'saturn.png', speed: 0.1 },
        { name: "Uranus", radius: 51118, texture: 'uranus.png', speed: 0.08 },
        { name: "Neptune", radius: 49528, texture: 'neptune.png', speed: 0.06 },
        { name: "Sun", radius: 696340, texture: 'sun.png', speed: 0 }  ];

    let maxRadius = Math.max(...planetsData.map(planet => planet.radius));
    let scaleFactor = 0.00005; 

    planetsData.forEach(data => {
        let geometry = new THREE.SphereGeometry(data.radius * scaleFactor, 32, 32);
        let texture = new THREE.TextureLoader().load(data.texture, { crossOrigin: null });
        let material = new THREE.MeshBasicMaterial({ map: texture });
        let planet = new THREE.Mesh(geometry, material);
        planet.name = data.name;
        planet.speed = data.speed;
        planets.push(planet);
        scene.add(planet);
    });
}

function createAsteroids() {
    for (let i = 0; i < 600; i++) {
        let rockSize = randomInRange(1, 3);
        let rockGeometry = new THREE.SphereGeometry(rockSize, 2, 9);
        let rockMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        let rock = new THREE.Mesh(rockGeometry, rockMaterial);
        let distance = randomInRange(170, 175);
        let angle = randomInRange(0, Math.PI * 2);
        rock.position.x = distance * Math.cos(angle);
        rock.position.z = distance * Math.sin(angle);
        rock.rotation.set(randomInRange(0, Math.PI * 2), randomInRange(0, Math.PI * 2), randomInRange(0, Math.PI * 2));
        asteroids.push(rock);
        scene.add(rock);
    }
}

function setupLights() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);
}

function animate() {
    planets.forEach(planet => {
        planet.rotation.y += planet.speed;
        if (planet.name !== "Sun") {
            let distance = 50 + 50 * planets.findIndex(p => p === planet);
            planet.position.x = distance * Math.cos(planet.rotation.y);
            planet.position.z = distance * Math.sin(planet.rotation.y);
        }
    });

    asteroids.forEach(asteroid => {
        let distance = Math.sqrt(asteroid.position.x ** 2 + asteroid.position.z ** 2);
        let angle = Math.atan2(asteroid.position.z, asteroid.position.x);
        let orbitalSpeed = 0.01; // Or your desired speed
        asteroid.rotation.y += orbitalSpeed;
        asteroid.position.x = distance * Math.cos(angle + orbitalSpeed);
        asteroid.position.z = distance * Math.sin(angle + orbitalSpeed);
    });

    let zoom = getParameter('zoomSlider');
    let cameraDistance = zoom * 2;
    camera.position.z = cameraDistance;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Helper functions
function getParameter(id) {
    return parseFloat(document.getElementById(id).value);
}

function zoomIn() {
    document.getElementById('zoomSlider').value = parseFloat(document.getElementById('zoomSlider').value) + 10;
}

function zoomOut() {
    document.getElementById('zoomSlider').value = parseFloat(document.getElementById('zoomSlider').value) - 10;
}

function toggleControlsPanel() {
    let controlsPanel = document.getElementById('controlsPanel');
    controlsPanel.style.display = controlsPanel.style.display === 'none' ? 'block' : 'none';
}

function zoomWithMouseWheel(event) {
    event.preventDefault();
    let delta = event.deltaY;
    let zoomSlider = document.getElementById('zoomSlider');
    zoomSlider.value = parseFloat(zoomSlider.value) + (delta > 0 ? -10 : 10);
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function handlePlanetClick(planet) {
    // Adjust camera to focus on the clicked planet
    const focusDistance = 100; // Adjust this distance according to your preference
    const focusPosition = planet.position.clone().add(new THREE.Vector3(0, 0, focusDistance));
    camera.position.copy(focusPosition);
    camera.lookAt(planet.position);

    // Show information window
    showPlanetInformation(planet);
}

// Helper function to show information window for the clicked planet
function showPlanetInformation(planet) {
    // Assuming you have some HTML element to display the information window
    const informationWindow = document.getElementById('planetInformation');
    informationWindow.style.display = 'block';
    informationWindow.innerHTML = `
        <h3>${planet.name}</h3>
        <p>Radius: ${planet.radius}</p>
        <p>Speed: ${planet.speed}</p>
        <!-- Add more information as needed -->
    `;
}

// Add event listener for click on each planet
planets.forEach(planet => {
    planet.addEventListener('click', () => handlePlanetClick(planet));
});


init();
