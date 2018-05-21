# Panorama全景

### 方法

- div + Css3 实现
  - 图片是围成了一个圆筒  参考 http://show.im20.com.cn/zwj/ 
  - 图片是分为了6张组成一个球 参考 https://threejs.org/examples/?q=pano#css3d_panorama_deviceorientation 
- Canvas Webgl 参考 https://threejs.org/examples/?q=pano#canvas_geometry_panorama



### JS插件：

- Threejs 全景参考 中 https://threejs.org/examples/?q=panorama

  - [css3d-engine](https://github.com/shrekshrek/css3d-engine) Threejs的3D核心类库

- [Pannellum](https://pannellum.org/)

  ​

### [制作全景图教程](http://vr.sina.com.cn/news/js/2017-08-18/doc-ifykcppx9208605.shtml)

- Ps 3D图层
- Ps 2D图层，利用Ps插件 [Flexify2](http://www.flamingpear.com/flexify-2.html) 转为全景图

### 工具

- 3D建模软件 [blender](https://www.blender.org/thanks/) Maya

- 在线建模 [three.js / editor](https://threejs.org/editor/) [ThreeFab](http://blackjk3.github.io/threefab/)


### 实测

[**Canvas渲染**](https://threejs.org/docs/#examples/renderers/CanvasRenderer)，即`new THREE.CanvasRenderer();` ，利用 Canvas 2D Api。**手机端**效果极其不好，iphone6s fps不到10。

[**WebGL渲染**](https://threejs.org/docs/#api/renderers/WebGLRenderer)，即`new THREE.WebGLRenderer();`，利用 GPU渲染的着色器。**手机端**性能不错，iphone6s fps30左右，无明显卡顿。

[**CSS3 3D渲染**](https://threejs.org/docs/#examples/renderers/CSS3DRenderer)，即`new THREE.CSS3DRenderer();`，利用 CSS3 3d transform，同样利用GPU加速。**手机端**效果不错，iphone6s fps60，流畅。



### 参考

[高冷的WebGL](https://juejin.im/entry/591d0b4d128fe1005cf6d90b)