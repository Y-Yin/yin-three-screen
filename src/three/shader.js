import * as THREE from 'three';
import { buildingColorTexture } from '@/three/texture';

// 建筑shader
export const bulidingShader = {
  vs: `
    varying float py;
    void main() {
      py = position.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fs: `
    varying float py;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 barColor;
    uniform float maxY;
    uniform float mixY;
    uniform float startY;
    uniform float barWidth;
    void main(){
      // 混合颜色 mix函数得到已百分比混合两个值
      // smoothstep函数可以用来生成0到1的平滑过渡值
      // 得到模型表面的渐变色
      vec3 color =  mix(color1, color2, smoothstep(mixY, maxY, py));
      float barWidth = barWidth * 0.5;
      // 柱条平滑过渡的值
      float barSmooth = smoothstep(startY - barWidth, startY, py) - smoothstep(startY, startY + barWidth, py);
      // 柱条的颜色
      vec4 barColorVec4 = vec4(barColor.r, barColor.g, barColor.b, 1.0);
      gl_FragColor = mix(vec4(color, 1.0), barColorVec4, barSmooth); 
    }
  `,
  uniforms: {
    // 开始的y值  -5.89~152.1
    startY: {
      value: 0.0
    },
    // 柱条的宽度
    barWidth: {
      value: 10.0
    },
    // 柱条的颜色
    barColor: {
      value: new THREE.Color('#e26714')
    },
    texture1: {
      value: buildingColorTexture
    },
    // 底部颜色
    color1: {
      value: new THREE.Color('#292A2A')
    },
    // 顶部颜色
    color2: {
      value: new THREE.Color('#08A4F5')
    },
    // y的最小值
    mixY: {
      value: -5.89
    },
    // y的最大值
    maxY: {
      value: 300
    }
  }
};

// 栅栏shander
export const rippleShader = {
  vs: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fs: `
    uniform float time;
    uniform float opacity;
    uniform vec3 color;
    uniform float num;
    varying vec2 vUv;
    void main(){
      vec4 fragColor = vec4(0.0, 0.0, 0.0, 0.0);
      // y=Asin(ωx+φ)  A:振幅（决定高矮） φ:初相（左右位置）  ω:角频率（决定胖瘦）
      float sin = sin((vUv.y - time) * 10.0 * num);
      float high = 0.9;
      if (sin > high) {
        // 获取颜色混合
        fragColor = vec4(mix(vec3(0.8, 1.0, 1.0), color, (1.0 - sin) / (1.0 - high)), 1.0);
      } else {
        fragColor = vec4(color, 0.0);
      }
      // 由y获得黑色的渐变色
      vec3 fade = mix(color, vec3(0.0, 0.0, 0.0), vUv.y);
      fragColor = mix(fragColor, vec4(fade, 1.0), 0.85);
      gl_FragColor = vec4(fragColor.rgb, opacity * (1.0 - vUv.y));
    }
  `,
  uniforms: {
    time: {
      value: 0.0
    },
    color: {
      value: new THREE.Color('#ff2f2f')
    },
    opacity: {
      value: 1.0
    },
    num: {
      value: 2
    }
  }
};

// 扩散圈shader
export const ringShader = {
  vs: `
    varying vec2 vUv;
    void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fs: `
    uniform float time;
    uniform vec3 color;
    uniform float num;
    varying vec2 vUv;
    void main(){
        float alpha = 1.0;
        float dis = distance(vUv,vec2(0.5));
        // 大于0.5的丢弃
        if(dis > 0.5){
            discard;
        }
        float y = (sin(6.0 * num *(dis-time)) + 1.0)/2.0;
        alpha = smoothstep(1.0,0.0,abs(y-0.5)/0.5) * (0.5 -dis) * 2.0;
        gl_FragColor = vec4(color, alpha);
    }
  `,
  uniforms: {
    color: {
      value: new THREE.Color('#f01616')
    },
    time: {
      value: 0
    },
    num: {
      value: 4
    }
  }
};
