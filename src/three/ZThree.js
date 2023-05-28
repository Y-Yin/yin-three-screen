import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

export default class ZThree {
  constructor(id) {
    this.id = id;
    this.el = document.getElementById(id);
  }

  // 初始化场景
  initThree() {
    let _this = this;
    let width = this.el.offsetWidth;
    let height = this.el.offsetHeight;
    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    this.camera.position.set(30, 30, 30);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.el.append(this.renderer.domElement);
    this.renderer.setClearColor('#000');
    this.gui = new GUI();

    window.addEventListener(
      'resize',
      function () {
        _this.camera.aspect = _this.el.offsetWidth / _this.el.offsetHeight;
        _this.camera.updateProjectionMatrix();
        _this.renderer.setSize(_this.el.offsetWidth, _this.el.offsetHeight);
        if (_this.cssRenderer) {
          _this.cssRenderer.setSize(_this.el.offsetWidth, _this.el.offsetHeight);
        }
      },
      false
    );
  }
  // 初始化光源
  initLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-30, 30, -30);
    this.scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(hemisphereLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
  }

  // 初始化helper
  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
  }

  // 初始化控制器
  initOrbitControls() {
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    controls.enablePan = true;

    let cameraStartPostion, cameraEndPostion;
    controls.addEventListener('start', () => {
      cameraStartPostion = this.camera.position.clone();
      controls.isClickLock = false;
    });

    controls.addEventListener('end', () => {
      cameraEndPostion = this.camera.position;
      const startXYZ = Object.values(cameraStartPostion).reduce(function (prev, curr) {
        return prev + curr;
      });
      const endXYZ = Object.values(cameraEndPostion).reduce(function (prev, curr) {
        return prev + curr;
      });
      if (Math.abs(endXYZ - startXYZ) < 0.1) {
        controls.isClickLock = false;
      } else {
        controls.isClickLock = true;
      }
      cameraStartPostion = null;
      cameraEndPostion = null;
    });
    this.controls = controls;
  }

  // 初始化status
  initStatus() {
    this.stats = new Stats();
    this.el.appendChild( this.stats.dom );
  }

  // 初始化射线
  initRaycaster(callback, models = this.scene.children, eventName = 'click') {
    this.raycaster = new THREE.Raycaster();

    // 绑定点击事件
    this.el.addEventListener(eventName, (evt) => {
      let mouse = {
        x: (evt.clientX / window.innerWidth) * 2 - 1,
        y: -(evt.clientY / window.innerHeight) * 2 + 1
      };

      let activeObj = this.fireRaycaster(mouse, models);
      if (activeObj.point) {
        console.log([activeObj.point.x, activeObj.point.y, activeObj.point.z]);
        console.log(activeObj);
      }
      if (callback) {
        callback(activeObj, evt, mouse);
      }

      //鼠标的变换
      document.body.style.cursor = 'pointer';
    });
  }

  // 返回选中物体
  fireRaycaster(pointer, models) {
    // 使用一个新的原点和方向来更新射线
    this.raycaster.setFromCamera(pointer, this.camera);

    let intersects = this.raycaster.intersectObjects(models, true);
    //
    if (intersects.length > 0) {
      let selectedObject = intersects[0];
      return selectedObject;
    } else {
      return false;
    }
  }

  loaderModel(option) {
    switch (option.type) {
      case 'obj':
        if (!this.objLoader) {
          this.objLoader = new OBJLoader();
        }
        if (!this.mtlLoader) {
          this.mtlLoader = new MTLLoader();
        }
        this.mtlLoader.load(option.mtlUrl || '', (materials) => {
          materials.preload();
          this.objLoader
            .setMaterials(materials)
            .load(option.url, option.onLoad, option.onProgress, option.onError);
        });
        break;

      case 'gltf':
      case 'glb':
        if (!this.gltfLoader) {
          this.gltfLoader = new GLTFLoader();
          let dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('draco/');
          this.gltfLoader.setDRACOLoader(dracoLoader);
        }
        this.gltfLoader.load(option.url, option.onLoad, option.onProgress, option.onError);
        break;

      case 'fbx':
        if (!this.fbxLoader) {
          this.fbxLoader = new FBXLoader();
        }
        this.fbxLoader.load(option.url, option.onLoad, option.onProgress, option.onError);
        break;

      default:
        console.error('当前只支持obj, gltf, glb, fbx格式');
        break;
    }
  }

  // 迭代加载
  iterateLoad(objFileList, onProgress, onAllLoad) {
    let fileIndex = 0;
    let that = this;

    function iterateLoadForIt() {
      that.loaderModel({
        type: objFileList[fileIndex].type,
        dracoUrl: objFileList[fileIndex].dracoUrl,
        mtlUrl: objFileList[fileIndex].mtlUrl,
        url: objFileList[fileIndex].url,
        onLoad: function (object) {
          if (objFileList[fileIndex].onLoad) objFileList[fileIndex].onLoad(object);
          fileIndex++;
          if (fileIndex < objFileList.length) {
            iterateLoadForIt();
          } else {
            if (onAllLoad) onAllLoad();
          }
        },
        onProgress: function (xhr) {
          if (objFileList[fileIndex].onProgress) objFileList[fileIndex].onProgress(xhr, fileIndex);
          if (onProgress) onProgress(xhr, fileIndex);
        }
      });
    }
    iterateLoadForIt();
  }

  // 加载天空盒
  loaderSky(path) {
    let skyTexture = new THREE.CubeTextureLoader().setPath(path).load([
      'px.jpg', //右
      'nx.jpg', //左
      'py.jpg', //上
      'ny.jpg', //下
      'pz.jpg', //前
      'nz.jpg' //后
    ]);
    return skyTexture;
  }

  flyTo(option) {
    option.position = option.position || []; // 相机新的位置
    option.controls = option.controls || []; // 控制器新的中心点位置(围绕此点旋转等)
    option.duration = option.duration || 1000; // 飞行时间
    option.easing = option.easing || TWEEN.Easing.Linear.None;
    TWEEN.removeAll();
    const curPosition = this.camera.position;
    const controlsTar = this.controls.target;
    const tween = new TWEEN.Tween({
      x1: curPosition.x, // 相机当前位置x
      y1: curPosition.y, // 相机当前位置y
      z1: curPosition.z, // 相机当前位置z
      x2: controlsTar.x, // 控制当前的中心点x
      y2: controlsTar.y, // 控制当前的中心点y
      z2: controlsTar.z // 控制当前的中心点z
    })
      .to(
        {
          x1: option.position[0], // 新的相机位置x
          y1: option.position[1], // 新的相机位置y
          z1: option.position[2], // 新的相机位置z
          x2: option.controls[0], // 新的控制中心点位置x
          y2: option.controls[1], // 新的控制中心点位置x
          z2: option.controls[2] // 新的控制中心点位置x
        },
        option.duration
      )
      .easing(TWEEN.Easing.Linear.None); // TWEEN.Easing.Cubic.InOut //匀速
    tween.onUpdate(() => {
      this.controls.enabled = false;
      this.camera.position.set(tween._object.x1, tween._object.y1, tween._object.z1);
      this.controls.target.set(tween._object.x2, tween._object.y2, tween._object.z2);
      this.controls.update();
      if (option.update instanceof Function) {
        option.update(tween);
      }
    });
    tween.onStart(() => {
      this.controls.enabled = false;
      if (option.start instanceof Function) {
        option.start();
      }
    });
    tween.onComplete(() => {
      this.controls.enabled = true;
      if (option.done instanceof Function) {
        option.done();
      }
    });
    tween.onStop(() => (option.stop instanceof Function ? option.stop() : ''));
    tween.start();
    TWEEN.add(tween);
    return tween;
  }

  // 渲染
  render(callback) {
    callback();
    this.frameId = requestAnimationFrame(() => this.render(callback));
  }
}
