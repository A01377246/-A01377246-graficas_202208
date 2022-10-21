"use strict";

import * as THREE from "../libs/three.js/three.module.js";
import { addMouseHandler } from "./sceneHandlers.js";
import { OrbitControls } from "../../libs/three.js/controls/OrbitControls.js";

let sun = {};

let renderer = null,
  scene = null,
  camera = null,
  orbitControls = null,
  mercury = null,
  mercuryGroup = null,
  venus = null,
  venusGroup = null,
  earth = null,
  earthGroup = null,
  mars = null,
  marsGroup = null,
  jupiter = null,
  jupiterGroup = null,
  saturn = null,
  saturnGroup = null,
  uranus = null,
  uranusGroup = null,
  neptune = null,
  neptuneGroup = null,
  pluto = null,
  plutoGroup = null,
  asteroidBelt = null,
  saturnRing = null,
  moon = null,
  sunGroup = null,
  geometry = null,
  planetGroup = null;

const duration = 5000; // ms
let currentTime = Date.now();

function main() {
  const canvas = document.getElementById("webglcanvas");
  createScene(canvas);
  update();
}

const createOrbit = (innerOrbitRadius, outerOrbitRadius, isSaturn) => {
  isSaturn = isSaturn || null;

  let orbitMaterial = null;

  if (isSaturn !== null) {
    const ringTextureURL = "./resources/saturn_ring_texture.png";
    const ringTexture = new THREE.TextureLoader().load(ringTextureURL);
    orbitMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
    });
  } else {
    //This basic material will not be affected by light, the parameters are passed as an object
    orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0xf7ef8a,
      side: THREE.DoubleSide,
    });
  }

  let geometryOfPlanetOrbit = new THREE.RingGeometry(
    innerOrbitRadius,
    outerOrbitRadius,
    100
  );
  let planetOrbit = new THREE.Mesh(geometryOfPlanetOrbit, orbitMaterial);
  planetOrbit.rotateX(30);
  return planetOrbit;
};

const createPlanet = (planetRadius, texture, bumpMap) => {
  bumpMap = bumpMap || null; //in case there is no bump map

  let planet = null;
  let planetMaterial = null;

  const planetTexture = new THREE.TextureLoader().load(texture);

  if (texture !== null) {
    //Set a bump map if it exists
    const bumpTexture = new THREE.TextureLoader().load(texture);

    planetMaterial = new THREE.MeshPhongMaterial({
      map: planetTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.2,
    });
  } else {
    //If a bump map does not exist only use the texture
    planetMaterial = new THREE.MeshPhongMaterial({ map: planetTexture });
  }

  geometry = new THREE.SphereGeometry(planetRadius, 10, 10);

  planet = new THREE.Mesh(geometry, planetMaterial);

  return planet;
};

const createSun = () => {
  const sunTextureURL = "./resources/sun_texture.jpg";
  const sunTexture = new THREE.TextureLoader().load(sunTextureURL);
  const material = new THREE.MeshPhongMaterial({ map: sunTexture });
  let geometry = new THREE.SphereGeometry(1.5, 10, 10);
  sun = new THREE.Mesh(geometry, material);
  return sun;
};

/**
 * Updates the rotation of the objects in the scene
 */
function animate() {
  const now = Date.now();
  const deltat = now - currentTime;
  currentTime = now;
  const fract = deltat / duration;
  const angle = Math.PI * 2 * fract;

  // Rotate the sphere group about its Y axis
  sunGroup.rotation.y -= angle / 2;
  mercuryGroup.rotation.y += angle * 1;
  mercury.rotation.y += angle / 2;
  venusGroup.rotation.y += angle * 2;
  venus.rotation.y += angle * 1.5;
  earthGroup.rotation.y += angle * 1.2;
  earth.rotation.y += angle * 1.3;
  marsGroup.rotation.y += angle * 1.3;
  mars.rotation.y += angle / 2;
  jupiterGroup.rotation.y += angle * 0.5;
  jupiter.rotation.y += angle * 1.8;
  moon.rotation.y += angle * 5;
  saturnGroup.rotation.y += angle * 0.8;
  saturn.rotation.y += angle * 1.2;
  saturnRing.rotation.z += angle * 5;
  uranusGroup.rotation.y += angle * 1;
  uranus.rotation.y += angle * 1.8;
  neptuneGroup.rotation.y += angle * 0.8;
  neptune.rotation.y += angle * 1.7;
  plutoGroup.rotation.y += angle * 1.5;
  pluto.rotation.y += angle * 2;
}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update() {
  requestAnimationFrame(function () {
    update();
  });

  // Render the scene
  renderer.render(scene, camera);

  // Spin the cube for next frame
  animate();
}

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas) {
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  // Set the viewport size
  renderer.setSize(canvas.width, canvas.height);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Set the background picture
  const spaceBackgroundURL = "./resources/spaceWithStars.jpeg";
  const sceneBackgroundTexture = new THREE.TextureLoader().load(
    spaceBackgroundURL
  );
  scene.background = sceneBackgroundTexture;

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    1,
    1000
  );
  camera.position.z = 60;
  scene.add(camera);
  orbitControls = new OrbitControls(camera, renderer.domElement);

  // Create a group to hold all the objects
  sunGroup = new THREE.Object3D();
  planetGroup = new THREE.Object3D();

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);

  // Position the light out from the scene, pointing at the origin
  directionalLight.position.set(-0.5, 0.2, 1);
  directionalLight.target.position.set(0, -2, 0);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
  scene.add(ambientLight);

  // Add a point light with no limit
  const light = new THREE.PointLight(0xffffff, 2.5, 0);
  // Position the light at the center of the scene,
  light.position.set(0, 0, 3);
  scene.add(light);

  sunGroup = new THREE.Object3D();
  sunGroup.add(createSun(), planetGroup);

  // sunGroup.add(planetGroup);

  // Now add the group to our scene
  scene.add(sunGroup);

  //Create Planets and their orbits !!

  //Mercury
  mercuryGroup = new THREE.Object3D();
  const mercuryTextureURL = "./resources/mercury_texture.jpg";
  const mercuryTextureBumpURL = "./resources/mercury_bumpmap.jpg";
  mercury = createPlanet(0.3, mercuryTextureURL, mercuryTextureBumpURL);
  //Mercury's orbit
  let mercuryOrbit = createOrbit(3, 3.1);

  mercuryGroup.add(mercury, mercuryOrbit);
  mercury.position.set(-3, 0, 0);
  sunGroup.add(mercuryGroup);

  //Venus
  venusGroup = new THREE.Object3D();
  const venusTextureURL = "./resources/venusTexture.jpg";
  const venusTextureBumpURL = "./resources/venus_bumpap.jpg";
  venus = createPlanet(0.1, venusTextureURL, venusTextureBumpURL);
  let venusOrbit = createOrbit(5.3, 5);

  venusGroup.add(venus, venusOrbit);
  venus.position.set(-5, 0, 0);
  scene.add(venusGroup);

  //Earth
  earthGroup = new THREE.Object3D();
  const earthTextureURL = "./resources/earth_texture.jpg";
  const earthTextureBumpURL = "./resources/earth_bumpmap.jpg";
  earth = createPlanet(0.28, earthTextureURL, earthTextureBumpURL);
  earthGroup.add(earth);
  earth.position.set(-6.6, 0, 0);

  //Earth's moon
  const moonTexture = "./resources/moon_texture.jpg";
  const moonBumpURL = "./resources/moon_bumpmap.jpg";
  moon = createPlanet(0.07, moonTexture, moonBumpURL);
  moon.position.set(-6.6, 0.5, 0);

  //Earth's orbit
  let earthOrbit = createOrbit(6.6, 6.5);
  earthGroup.add(moon, earthOrbit);

  scene.add(earthGroup);

  //Mars
  marsGroup = new THREE.Object3D();
  const marsTextureURL = "./resources/mars_texture.jpg";
  const marsTextureBumpURL = "./resources/mars_bumpmap.jpg";
  mars = createPlanet(0.25, marsTextureURL, marsTextureBumpURL);
  marsGroup.add(mars);
  mars.position.set(-9, 0, 0);
  let marsOrbit = createOrbit(9, 8.9);
  marsGroup.add(mars, marsOrbit);
  scene.add(marsGroup);

  //Jupiter

  jupiterGroup = new THREE.Object3D();
  const jupiterTextureURL = "./resources/jupiter_texture.jpg";
  jupiter = createPlanet(0.7, jupiterTextureURL);
  jupiter.position.set(-14, 0, 0);
  let jupiterOrbit = createOrbit(14, 13.9);
  jupiterGroup.add(jupiter, jupiterOrbit);
  scene.add(jupiterGroup);

  //Saturn

  saturnGroup = new THREE.Object3D();
  const saturnTextureURL = "./resources/saturn_texture.jpg";
  saturn = createPlanet(0.67, saturnTextureURL);
  saturn.position.set(-18, 0, 0);
  let saturnOrbit = createOrbit(18, 17.9);
  saturnRing = createOrbit(1, 1.1, true);
  saturnRing.position.set(-18, 0, 0);

  saturnGroup.add(saturn, saturnRing, saturnOrbit);

  scene.add(saturnGroup);

  //Uranus

  uranusGroup = new THREE.Object3D();
  const uranusTextureURL = "./resources/uranus_texture.jpg";
  uranus = createPlanet(0.45, uranusTextureURL);
  uranus.position.set(-22, 0, 0);
  let uranusOrbit = createOrbit(22, 21.9);
  uranusGroup.add(uranus, uranusOrbit);

  scene.add(uranusGroup);

  //Neptune

  neptuneGroup = new THREE.Object3D();
  const neptuneTextureURL = "./resources/neptune_texture.jpg";
  neptune = createPlanet(0.4, neptuneTextureURL);
  neptune.position.set(-25, 0, 0);
  let neptuneOrbit = createOrbit(25, 24.9);
  neptuneGroup.add(neptune, neptuneOrbit);
  scene.add(neptuneGroup);

  //Pluto

  plutoGroup = new THREE.Object3D();
  const plutoTextureURL = "./resources/pluto_texture.jpg";
  pluto = createPlanet(0.2, plutoTextureURL);
  pluto.position.set(-28, 0, 0);
  let plutoOrbit = createOrbit(28, 27.9);
  plutoGroup.add(pluto, plutoOrbit);
  scene.add(plutoGroup);

  // add mouse handling so we can rotate the scene
  addMouseHandler(canvas, sunGroup);
}

main();
