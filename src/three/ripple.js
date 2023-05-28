import * as THREE from 'three';
import { rippleMaterial } from './material';

export function createRipple(array, height, isClose = true) {
  if (isClose) {
    array.push(array[0], array[1], array[2]);
  }
  let positions = [];
  let uvs = [];
  let uvMax = 1;
  for (let i = 0, j = 0, t = 0; i < array.length - 3; i = i + 3) {
    // 以一个顶点计算出当前栅栏的那一面
    let x1 = array[i];
    let y1 = array[i + 1];
    let z1 = array[i + 2];

    let x2 = array[i + 3];
    let y2 = array[i + 4];
    let z2 = array[i + 5];

    positions[j++] = x1;
    positions[j++] = y1;
    positions[j++] = z1;
    uvs[t++] = 0;
    uvs[t++] = 0;

    positions[j++] = x2;
    positions[j++] = y2;
    positions[j++] = z2;
    uvs[t++] = 1;
    uvs[t++] = 0;

    positions[j++] = x1;
    positions[j++] = height;
    positions[j++] = z1;
    uvs[t++] = 0;
    uvs[t++] = uvMax;

    positions[j++] = x1;
    positions[j++] = height;
    positions[j++] = z1;
    uvs[t++] = 0;
    uvs[t++] = uvMax;

    positions[j++] = x2;
    positions[j++] = 0;
    positions[j++] = z2;
    uvs[t++] = uvMax;
    uvs[t++] = 0;

    positions[j++] = x2;
    positions[j++] = height;
    positions[j++] = z2;
    uvs[t++] = 1;
    uvs[t++] = uvMax;
  }
  const bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );
  bufferGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

  const ripple = new THREE.Mesh(bufferGeometry, rippleMaterial);
  return ripple;
}
