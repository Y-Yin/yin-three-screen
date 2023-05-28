<template>
  <div id="screen" class="screen"></div>
</template>

<script setup>
import { ref } from 'vue';
import ZThree from "../three/ZThree";
let app, camera, scene, renderer, controls, clock, pointScene;

// 定义相机位置
const cameraPos = ref([-19.65, 398, 341])




const initThree = () => {
  clock = new THREE.Clock();
  app = new ZThree("screen");
  app.initThree();
  // app.initHelper();
  app.initLight();
  app.initOrbitControls();
  // app.initRaycaster();
  window.app = app;
  camera = app.camera;
  camera.position.set(...cameraPos.value);
  scene = app.scene;
  renderer = app.renderer;
  // renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.logarithmicDepthBuffer = true;
  controls = app.controls;
  controls.target.set(...this.controlsTarget);
  controls.maxPolarAngle = Math.PI / 2.2;

  app.skyTexture = app.loaderSky("texture/sky/");
  scene.background = app.skyTexture;
  scene.environment = app.skyTexture;

  loaderModel(app);

  let instance = new cssRender(CSS3DRenderer, app);
  app.cssRenderer = instance.cssRenderer;
  app.instance = instance;

  //粒子特效
  const total = 1000;
  const height = 500;
  const width = 500;
  const depth = 40;
  pointScene = addPoints(app, total, height, width, depth);

  app.render(() => {
    if (this.isShowChart) {
      if (pointScene) {
        pointScene.geometry.vertices.forEach((item) => {
          item.x -= item.direction.x * 0.1;
          item.y -= item.direction.y * 0.1;
          item.z -= item.direction.z * 0.1;
          if (item.x > width || item.x < -width) item.x = item.origin.x;
          if (item.y > width || item.y < -width) item.y = item.origin.y;
          if (item.z > width || item.z < -width) item.z = item.origin.z;
        });
        pointScene.geometry.verticesNeedUpdate = true;
      }

      bulidingShader.uniforms.startY.value =
        bulidingShader.uniforms.startY.value > 152.1
          ? -5.89
          : bulidingShader.uniforms.startY.value + 0.5;

      if (rippleShader) {
        rippleShader.uniforms.time.value += 0.005;
      }

      if (ringShader) {
        ringShader.uniforms.time.value += 0.005;
      }

      controls.update(clock.getDelta());
      renderer.render(scene, camera);
      app.cssRenderer.render(scene, camera);
      TWEEN.update();
    }
  });
};

initThree;
</script>
