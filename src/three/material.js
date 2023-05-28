import * as THREE from 'three';
import { geziTexture, pointTexture, buildingColorTexture } from './texture';
import { bulidingShader, rippleShader, ringShader } from '@/three/shader';

// 点材质
export const pointMaterial = new THREE.PointsMaterial({
  size: 2,
  map: pointTexture,
  fog: true,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true, // 透明
  opacity: 1 // 透明度
});

// 格子材质
export const geziMaterial = new THREE.MeshBasicMaterial({
  map: geziTexture,
  transparent: true
});

// 建筑材质
export const building0Material = new THREE.MeshStandardMaterial({
  map: buildingColorTexture,
  color: '#fff'
});
export const building1Material = new THREE.ShaderMaterial({
  uniforms: bulidingShader.uniforms,
  vertexShader: bulidingShader.vs,
  fragmentShader: bulidingShader.fs,
  side: THREE.DoubleSide,
  transparent: true
});
export const building2Material = new THREE.MeshBasicMaterial({
  color: '#57d8ff',
  wireframe: true
});

// cone材质
export const coneMaterial = new THREE.MeshStandardMaterial({
  color: '#ffff00'
});

export const rippleMaterial = new THREE.ShaderMaterial({
  vertexShader: rippleShader.vs,
  fragmentShader: rippleShader.fs,
  uniforms: rippleShader.uniforms,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false
});

// ring材质
export const ringMaterial = new THREE.ShaderMaterial({
  uniforms: ringShader.uniforms,
  vertexShader: ringShader.vs,
  fragmentShader: ringShader.fs,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  depthTest: true,
  side: THREE.DoubleSide,
  transparent: true
});
