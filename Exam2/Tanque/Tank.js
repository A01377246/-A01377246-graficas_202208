"use strict";

import * as THREE from "./libs/three.module.js";
import { OrbitControls } from "./libs/controls/OrbitControls.js";
import { OBJLoader } from "./libs/loaders/OBJLoader.js";
import { GUI } from "./libs/dat.gui.module.js";

let renderer = null,
  scene = null,
  camera = null,
  orbitControls = null;

let ambientLight = null;

let tankObjectList = [];

let turretObjectList = [];

let settings = null;

let mapUrl = "./checker_large.gif";

let tankGroup = null;
let turretGroup = null;

const tankTextureURL = "./Tank/Tank_texture.jpg";
const tankTexture = new THREE.TextureLoader().load(tankTextureURL);

let tankObjModelUrl = {
  obj: "./Tank/Tank.obj",
  texture: tankTexture,
};
let turretObjModelUrl = {
  obj: "./Tank/Turret.obj",
  texture: tankTexture,
};

const createTankGui = () => {
  const tankGui = new GUI({ width: 200 });

  settings = {
    "Tank Y": 0,
    "Turret Y": 0,
  };

  tankGui.add(settings, "Turret Y", 0, 10, 1).onChange((delta) => {
    turretObjectList[0].rotation.y = delta;
  });

  tankGui.add(settings, "Tank Y", 0, 10, 1).onChange((delta) => {
    tankObjectList[0].rotation.y = delta;
  });
};

async function loadObj(objModelUrl, objectList, x, y, z) {
  try {
    const object = await new OBJLoader().loadAsync(
      objModelUrl.obj,
      onProgress,
      onError
    );

    let texture = objModelUrl.texture;

    // object.traverse(function (child)
    // {
    for (const child of object.children) {
      //     if (child.isMesh)
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.map = texture;
      child.material.color.set("lime");
    }
    // });

    object.scale.set(3, 3, 3);
    object.position.z = z;
    object.position.x = x;
    object.position.y = y;

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

function onError(err) {
  console.error(err);
}

function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(
      xhr.target.responseURL,
      Math.round(percentComplete, 2) + "% downloaded"
    );
  }
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

  //Adding th light in front of the tank

  const pointLight = new THREE.PointLight(0xffffff, 3, 100);
  pointLight.position.set(-3, -1.5, 1);
  scene.add(pointLight);

  // Creting the objects
  tankGroup = new THREE.Object3D();
  turretGroup = new THREE.Object3D();

  tankGroup.add(loadObj(tankObjModelUrl, tankObjectList, -3, -1.2, 0));
  turretGroup.add(loadObj(turretObjModelUrl, turretObjectList, -3, 0, 0));
}

main();
