import * as THREE from 'three';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';

const textureLoader = new THREE.TextureLoader();
const tgaLoader = new TGALoader();

// 建筑贴图
export const buildingColorTexture = textureLoader.load(
  'texture/Facade002_1K_Color.jpg'
);
buildingColorTexture.wrapS = buildingColorTexture.wrapT = THREE.RepeatWrapping;
buildingColorTexture.repeat.set(400, -400);

// 粒子贴图
export const pointTexture = textureLoader.load('texture/TX-GY-021_p1.png');

// 格子贴图
export const geziTexture = tgaLoader.load('texture/gezi.tga');
geziTexture.wrapS = geziTexture.wrapT = THREE.RepeatWrapping;
geziTexture.repeat.set(50, 50);

// 线条贴图
export const secondaryTexture = textureLoader.load('texture/green_line.png');
secondaryTexture.wrapS = secondaryTexture.wrapT = THREE.RepeatWrapping;
export const trunkTexture = textureLoader.load('texture/red_line.png');
trunkTexture.wrapS = trunkTexture.wrapT = THREE.RepeatWrapping;
export const primaryTexture = textureLoader.load('texture/blue_line.png');
primaryTexture.wrapS = primaryTexture.wrapT = THREE.RepeatWrapping;
