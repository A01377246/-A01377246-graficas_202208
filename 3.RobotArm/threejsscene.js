"use strict";

import * as THREE from "../libs/three.js/three.module.js";
import { addMouseHandler } from "./sceneHandlers.js";
import { GUI } from "../libs/three.js/libs/dat.gui.module.js";

let renderer = null,
  scene = null,
  camera = null,
  shoulder = null,
  forearm = null,
  elbow = null,
  wrist = null,
  hand = null,
  arm = null,
  armGroup = null,
  shoulderGroup = null,
  elbowGroup = null,
  wristGroup = null,
  handGroup = null,
  forearmGroup = null;

let settings = null;

function createRobotArmMovementPanel() {
  const MovementGui = new GUI({ width: 200 });

  settings = {
    "Shoulder X": 0,
    "Shoulder Y": 0,
    "Elbow X": 0,
    "Forearm Y": 0,
    "Wrist X": 0,
    "Hand Y": 0,
    "Hand Z": 0,
  };

  MovementGui.add(settings, "Shoulder X", -1.5, 1.5, 0.001).onChange(
    (delta) => {
      shoulderGroup.rotation.x = delta;
    }
  );
  MovementGui.add(settings, "Shoulder Y", -1.5, 1.5, 0.001).onChange(
    (delta) => {
      shoulderGroup.rotation.y = delta;
    }
  );
  MovementGui.add(settings, "Elbow X", -0.5, 0.5, 0.001).onChange((delta) => {
    elbowGroup.rotation.x = delta;
  });
  MovementGui.add(settings, "Forearm Y", -1.5, 1.5, 0.001).onChange((delta) => {
    forearmGroup.rotation.y = delta;
  });
  MovementGui.add(settings, "Wrist X", -1.5, 1.5, 0.001).onChange((delta) => {
    wristGroup.rotation.y = delta;
  });
  MovementGui.add(settings, "Hand Y", -1.5, 1.5, 0.001).onChange((delta) => {
    handGroup.rotation.y = delta;
  });
  MovementGui.add(settings, "Hand Z", -0.1, 0.1, 0.001).onChange((delta) => {
    handGroup.rotation.z = delta;
  });
}

const duration = 5000; // ms
let currentTime = Date.now();

function main() {
  const canvas = document.getElementById("webglcanvas");
  createScene(canvas);
  update();
}

/**
 * Updates the rotation of the objects in the scene
 */
function animate() {
  const now = Date.now();
  const deltat = now - currentTime;
  currentTime = now;
  const fract = deltat / duration;
  const angle = Math.PI * 2 * fract;

  // Rotate the cube about its Y axis
  // cube.rotation.y += angle;
  shoulder.rotation.y += angle;

  /* Rotate the sphere group about its Y axis
    sphereGroup.rotation.x -= angle / 2;
    sphere.rotation.y += angle * 2;

    // Rotate the cone about its X axis (tumble forward)
    coneGroup.rotation.x += angle;
    */
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

  // Set the background color
  scene.background = new THREE.Color(0.2, 0.2, 0.2);

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 20);
  camera.position.z = 10;
  scene.add(camera);

  // Create a group to hold all the objects
  shoulderGroup = new THREE.Object3D();

  console.log(shoulderGroup.position);

  // Add a directional light to show off the objects
  const light = new THREE.DirectionalLight(0xffffff, 1.0);

  // Position the light out from the scene, pointing at the origin
  light.position.set(-0.5, 0.2, 1);
  light.target.position.set(0, -2, 0);
  scene.add(light);

  // This light globally illuminates all objects in the scene equally.
  // Cannot cast shadows
  const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
  scene.add(ambientLight);

  const textureUrl = "../images/ash_uvgrid01.jpg";
  const texture = new THREE.TextureLoader().load(textureUrl);
  const material = new THREE.MeshPhongMaterial({ map: texture });

  // Create the cube geometry
  let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  // And put the geometry and material together into a mesh
  shoulder = new THREE.Mesh(geometry, material);

  //Geometry for the arm
  geometry = new THREE.BoxGeometry(0.4, 0.8, 0.4);
  arm = new THREE.Mesh(geometry, material);

  //Geometry for the elbow
  geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  elbow = new THREE.Mesh(geometry, material);

  //Geometry for the forearm

  geometry = new THREE.BoxGeometry(0.4, 1, 0.3);
  forearm = new THREE.Mesh(geometry, material);

  //Geometry for the wrist

  geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  wrist = new THREE.Mesh(geometry, material);

  //Geometry for the hand

  geometry = new THREE.BoxGeometry(0.5, 0.4, 0.3);
  hand = new THREE.Mesh(geometry, material);

  armGroup = new THREE.Object3D();
  elbowGroup = new THREE.Object3D();
  forearmGroup = new THREE.Object3D();
  wristGroup = new THREE.Object3D();
  handGroup = new THREE.Object3D();

  // Add the cube mesh to our group

  handGroup.add(hand);
  wristGroup.add(wrist);
  wristGroup.add(handGroup);

  elbowGroup.add(forearmGroup);
  elbowGroup.add(elbow);

  armGroup.add(arm);
  armGroup.add(elbowGroup);
  shoulderGroup.add(shoulder);
  shoulderGroup.add(armGroup);
  forearmGroup.add(forearm);
  forearmGroup.add(wristGroup);

  shoulderGroup.position.set(1, 0, 0);
  armGroup.position.set(0, -0.65, 0);
  elbowGroup.position.set(0, -0.5, 0);
  forearmGroup.position.set(0, -0.68, 0);
  wristGroup.position.set(0, -0.66, 0);
  handGroup.position.set(0, -0.4, 0);
  // Now add the group to our scene
  scene.add(shoulderGroup);

  // add mouse handling so we can rotate the scene
  addMouseHandler(canvas, shoulderGroup);
}

createRobotArmMovementPanel();
main();
