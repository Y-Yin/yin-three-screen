import * as THREE from 'three';
import { pointMaterial } from '@/three/material';

// 粒子特效
export function addPoints(app, total, height, width, depth) {
  const geometry = new THREE.Geometry();
  for (let i = 0; i < total; i++) {
    const vertex = new THREE.Vector3();
    const x = Math.random() * width - width * 0.5;
    const y = Math.random() * height - height * 0.5;
    const z = Math.random() * depth - depth * 0.5;

    vertex.x = x;
    vertex.y = y;
    vertex.z = z;

    vertex.origin = new THREE.Vector3();
    vertex.origin.x = x;
    vertex.origin.y = y;
    vertex.origin.z = z;

    vertex.direction = new THREE.Vector3();
    vertex.direction.x = Math.random() - 0.5;
    vertex.direction.y = Math.random() - 0.5;
    vertex.direction.z = Math.random() - 0.5;
    geometry.vertices.push(vertex);
  }

  const points = new THREE.Points(geometry, pointMaterial);
  app.scene.add(points);
  return points;
}
