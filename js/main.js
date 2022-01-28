import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let textMesh = new THREE.Mesh();
let rain, rainGeo;

lighting();
text();
particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let rainDrop = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(rainDrop);
  }

  rainGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("../assets/images/star.png");
  let rainMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  rain = new THREE.Points(rainGeo, rainMaterial);
  scene.add(rain);
}

function animateParticles() {
  rain.position.y -= 0.9;

  if (rain.position.y < -200){
    rain.position.y = 200;
  }
  rainGeo.verticesNeedUpdate = true;
}

function text() {
  const texture = new THREE.TextureLoader().load("../assets/textures/wooden.jpg");
  

  const loader = new FontLoader();
  loader.load('../assets/fonts/Montserrat_Regular.json', function(font) {
    const textGeometry = new TextGeometry('NEIL', {
      font: font,
      size:5,
      height:1,
    })
    textGeometry.center();
    const textMaterial = new THREE.MeshPhongMaterial({ map: texture });
    textMesh = new THREE.Mesh(textGeometry,textMaterial);
    scene.add(textMesh);
  });
  camera.position.z = 20;
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  textMesh.rotation.x += 0.008
  textMesh.rotation.y += 0.008
 
  renderer.render(scene, camera);
}

animate();
