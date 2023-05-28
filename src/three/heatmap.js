import * as THREE from 'three';

export function heatMap(width, height) {
  //随机给出温度值  储存在2维数组
  let getTemperature = () => {
    var temperatureArray = new Array();
    for (let i = 0; i < 9; i++) {
      temperatureArray[i] = new Array();
      for (let j = 0; j < 9; j++) {
        temperatureArray[i][j] = parseInt(Math.random() * 35);
      }
    }
    return temperatureArray;
  };

  //获取温度点的XY坐标
  let getPositionXY = (i, j) => {
    let positionX = [5, 20, 35, 50, 65, 80, 95, 80, 90];
    let positionY = [5, 20, 35, 50, 65, 80, 95, 80, 90];
    return {
      x: positionX[i],
      y: positionY[j]
    };
  };

  //绘制辐射圆
  let drawCircular = (context, opts) => {
    let { x, y, radius, weight } = opts;

    radius = parseInt(radius * weight); //计算出实际的辐射圆

    // 创建圆设置填充色
    let rGradient = context.createRadialGradient(x, y, 0, x, y, radius);
    rGradient.addColorStop(0, 'rgba(0, 1, 0, 1)');
    rGradient.addColorStop(1, 'rgba(1, 0, 0, 0)');
    context.fillStyle = rGradient;

    // 设置globalAlpha
    context.globalAlpha = weight;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.closePath();

    context.fill(); // 填充
  };

  let createPalette = () => {
    //颜色条的颜色分布
    let colorStops = {
      0: '#0ff',
      0.4: '#0f0',
      0.8: '#ff0',
      1: '#f00'
    };
    //颜色条的大小
    let width = 256,
      height = 1;
    // 创建canvas
    let paletteCanvas = document.createElement('canvas');
    paletteCanvas.width = width;
    paletteCanvas.height = height;
    let ctx = paletteCanvas.getContext('2d');

    // 创建线性渐变色
    let linearGradient = ctx.createLinearGradient(0, 0, width, 0);
    for (const key in colorStops) {
      linearGradient.addColorStop(key, colorStops[key]);
    }

    // 绘制渐变色条
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, width, height);

    let imageData = ctx.getImageData(0, 0, width, height).data; // 读取像素值

    return {
      canvas: paletteCanvas,
      pickColor: function (position) {
        return imageData.slice(position * 4, position * 4 + 3);
      }
    };
  };

  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let context = canvas.getContext('2d');
  let tenperature = getTemperature();

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let weight = tenperature[i][j] / 33; //计算出当前温度占标准温度的权值
      drawCircular(context, {
        x: getPositionXY(i, j).x,
        y: getPositionXY(i, j).y,
        radius: 20,
        weight: weight
      });
    }
  }
  let palette = createPalette();
  document.body.appendChild(palette.canvas);
  let imageData = context.getImageData(0, 0, width, height);
  let data = imageData.data;

  for (let i = 3; i < data.length; i += 4) {
    //根据画面数据绘制颜色
    let alpha = data[i];
    let color = palette.pickColor(alpha);
    data[i - 3] = color[0];
    data[i - 2] = color[1];
    data[i - 1] = color[2];
  }

  for (var i = 0; i < imageData.data.length; i += 4) {
    // 背景设置成青色
    if (imageData.data[i + 3] == 0) {
      imageData.data[i] = 0;
      imageData.data[i + 1] = 255;
      imageData.data[i + 2] = 255;
      imageData.data[i + 3] = 255;
    }
  }
  context.putImageData(imageData, 0, 0); //设置画面数据
  return canvas;
}
