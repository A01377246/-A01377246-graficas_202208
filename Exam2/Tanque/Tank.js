"use strict";

import * as THREE from "./libs/three.module.js";
import { OrbitControls } from "./libs/controls/OrbitControls.js";
import { OBJLoader } from "./libs/loaders/OBJLoader";
import { GUI } from "./libs/dat.gui.module.js";

let renderer = null,
  scene = null,
  camera = null,
  orbitControls = null;

let ambientLight = null;

let settings = null;

let mapUrl = "./checker_large.gif";

const createTankGui = () => {
  const tankGui = new GUI({ width: 200 });

  settings = {
    "Tank Y": 0,
    "Turret Y": 0,
  };
};

async function loadObj(objModelUrl, objectList) {
  try {
    const object = await new OBJLoader().loadAsync(
      objModelUrl.obj,
      onProgress,
      onError
    );

    let texture = objModelUrl.hasOwnProperty("normalMap")
      ? new THREE.TextureLoader().load(objModelUrl.map)
      : null;
    let normalMap = objModelUrl.hasOwnProperty("normalMap")
      ? new THREE.TextureLoader().load(objModelUrl.normalMap)
      : null;
    let specularMap = objModelUrl.hasOwnProperty("specularMap")
      ? new THREE.TextureLoader().load(objModelUrl.specularMap)
      : null;

    console.log(object);

    // object.traverse(function (child)
    // {
    for (const child of object.children) {
      //     if (child.isMesh)
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.map = texture;
      child.material.normalMap = normalMap;
      child.material.specularMap = specularMap;
    }
    // });

    object.scale.set(3, 3, 3);
    object.position.z = -3;
    object.position.x = -1.5;
    object.rotation.y = -3;
    object.name = "objObject";

    objectList.push(object);
    scene.add(object);
  } catch (err) {
    onError(err);
  }
}

function main() {
  const canvas = document.getElementById("webglcanvas");

  createScene(canvas);

  createTankGui();

  update();
}

function update() {
  requestAnimationFrame(function () {
    update();
  });

  renderer.render(scene, camera);

  orbitControls.update();
}

async function createScene(canvas) {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  renderer.setSize(canvas.width, canvas.height);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    1,
    4000
  );
  camera.position.set(0, 3, 10);

  orbitControls = new OrbitControls(camera, renderer.domElement);

  ambientLight = new THREE.AmbientLight(0x444444, 0.8);
  scene.add(ambientLight);

  const map = new THREE.TextureLoader().load(mapUrl);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(8, 8);

  let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
  let mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide })
  );

  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -4.02;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

main();
