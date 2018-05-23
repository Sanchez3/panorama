/**
 * Created by sanchez 
 */
'use strict';

//check the environment
// if (process.env.NODE_ENV !== 'production') {
//     console.log('Looks like we are in development mode!');
// }

// import CSS
// import animate_css from 'animate.css/animate.min.css';
import css from '../css/css.css';


// import Js Plugins/Entities
// import './entities/orienter.js'

// import THREE from 'three';
import CSS3DRenderer from 'three/examples/js/renderers/CSS3DRenderer.js';
import CanvasRenderer from 'three/examples/js/renderers/CanvasRenderer.js';
import DeviceOrientationControls from './entities/DeviceOrientationControls.js';
import Projector from 'three/examples/js/renderers/Projector.js';
// import OrbitControls from 'three/js/controls/OrbitControls.js';
import 'whatwg-fetch';
import figlet from 'figlet';
figlet.defaults({ fontPath: "assets/fonts" });
figlet('Panorama', function(err, text) {
    if (err) {
        console.log('something went wrong...');
        console.dir(err);
        return;
    }
    console.log(text);
});

window.h5 = {
    initCss3DR: function() {
        var camera, scene, renderer;
        var geometry, material, mesh;
        var controls;
        init();
        animate();

        function init() {
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            controls = new THREE.DeviceOrientationControls(camera);
            scene = new THREE.Scene();
            var sides = [{
                    url: './assets/img/px.jpg',
                    position: [-512, 0, 0],
                    rotation: [0, Math.PI / 2, 0]
                },
                {
                    url: './assets/img/nx.jpg',
                    position: [512, 0, 0],
                    rotation: [0, -Math.PI / 2, 0]
                },
                {
                    url: './assets/img/py.jpg',
                    position: [0, 512, 0],
                    rotation: [Math.PI / 2, 0, Math.PI]
                },
                {
                    url: './assets/img/ny.jpg',
                    position: [0, -512, 0],
                    rotation: [-Math.PI / 2, 0, Math.PI]
                },
                {
                    url: './assets/img/pz.jpg',
                    position: [0, 0, 512],
                    rotation: [0, Math.PI, 0]
                },
                {
                    url: './assets/img/nz.jpg',
                    position: [0, 0, -512],
                    rotation: [0, 0, 0]
                }
            ];
            var cube = new THREE.Object3D();
            scene.add(cube);
            for (var i = 0; i < sides.length; i++) {
                var side = sides[i];
                var element = document.createElement('img');
                element.width = 1026; // 2 pixels extra to close the gap.
                element.src = side.url;
                var object = new THREE.CSS3DObject(element);
                object.position.fromArray(side.position);
                object.rotation.fromArray(side.rotation);
                cube.add(object);
            }
            renderer = new THREE.CSS3DRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            //
            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
    },
    initWebGLR: function() {
        var camera, scene, renderer;
        var controls;
        var texture_placeholder,
            isUserInteracting = false,
            onMouseDownMouseX = 0,
            onMouseDownMouseY = 0,
            lon = 90,
            onMouseDownLon = 0,
            lat = 0,
            onMouseDownLat = 0,
            phi = 0,
            theta = 0,
            target = new THREE.Vector3();
        var onPointerDownPointerX, onPointerDownPointerY, onPointerDownLon, onPointerDownLat;

        init();
        animate();

        function init() {
            var container, mesh;
            container = document.getElementById('container');
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
            controls = new THREE.DeviceOrientationControls(camera);
            scene = new THREE.Scene();
            texture_placeholder = document.createElement('canvas');
            texture_placeholder.width = 128;
            texture_placeholder.height = 128;
            var context = texture_placeholder.getContext('2d');
            context.fillStyle = 'rgb( 200, 200, 200 )';
            context.fillRect(0, 0, texture_placeholder.width, texture_placeholder.height);
            var materials = [
                loadTexture('./assets/img/px.jpg'), // right
                loadTexture('./assets/img/nx.jpg'), // left
                loadTexture('./assets/img/py.jpg'), // top
                loadTexture('./assets/img/ny.jpg'), // bottom
                loadTexture('./assets/img/pz.jpg'), // back
                loadTexture('./assets/img/nz.jpg') // front
            ];
            var geometry = new THREE.BoxGeometry(300, 300, 300, 7, 7, 7);
            geometry.scale(-1, 1, 1);
            mesh = new THREE.Mesh(geometry, materials);
            scene.add(mesh);

            function webglAvailable() {
                try {
                    var canvas = document.createElement('canvas');
                    return !!(window.WebGLRenderingContext && (
                        canvas.getContext('webgl') ||
                        canvas.getContext('experimental-webgl')));
                } catch (e) {
                    return false;
                }
            }

            if (webglAvailable()) {
                renderer = new THREE.WebGLRenderer();
            } else {

                renderer = new THREE.CanvasRenderer();
            }
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            // document.addEventListener('mousedown', onDocumentMouseDown, false);
            // document.addEventListener('mousemove', onDocumentMouseMove, false);
            // document.addEventListener('mouseup', onDocumentMouseUp, false);
            // document.addEventListener('wheel', onDocumentMouseWheel, false);
            // document.addEventListener('touchstart', onDocumentTouchStart, false);
            // document.addEventListener('touchmove', onDocumentTouchMove, false);
            // document.addEventListener('touchend', onDocumentTouchEnd, false);
            //
            window.addEventListener('resize', onWindowResize, false);
        }

        // function onDocumentMouseDown(event) {
        //     event.preventDefault();
        //     isUserInteracting = true;
        //     onPointerDownPointerX = event.clientX;
        //     onPointerDownPointerY = event.clientY;
        //     onPointerDownLon = lon;
        //     onPointerDownLat = lat;
        // }

        // function onDocumentMouseMove(event) {
        //     if (isUserInteracting === true) {
        //         lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        //         lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        //     }
        // }

        // function onDocumentMouseUp(event) {
        //     isUserInteracting = false;
        // }

        // function onDocumentMouseWheel(event) {
        //     var fov = camera.fov + event.deltaY * 0.05;
        //     camera.fov = THREE.Math.clamp(fov, 10, 75);
        //     camera.updateProjectionMatrix();
        // }

        // function onDocumentTouchStart(event) {
        //     if (event.touches.length == 1) {
        //         event.preventDefault();
        //         isUserInteracting = true;
        //         onPointerDownPointerX = event.touches[0].pageX;
        //         onPointerDownPointerY = event.touches[0].pageY;
        //         onPointerDownLon = lon;
        //         onPointerDownLat = lat;
        //     }
        // }

        // function onDocumentTouchMove(event) {
        //     if (event.touches.length == 1) {
        //         event.preventDefault();
        //         lon = (onPointerDownPointerX - event.touches[0].pageX) * 0.1 + onPointerDownLon;
        //         lat = (event.touches[0].pageY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        //     }
        // }

        function onDocumentTouchEnd(event) {
            isUserInteracting = false;
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function loadTexture(path) {
            var texture = new THREE.Texture(texture_placeholder);
            var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
            var image = new Image();
            image.onload = function() {
                texture.image = this;
                texture.needsUpdate = true;
            };
            image.src = path;
            return material;
        }

        function animate() {
            requestAnimationFrame(animate);

            update();
        }

        function update() {
            if (isUserInteracting === false) {
                controls.update();
            } else {
                console.log('Looks')
                lat = Math.max(-85, Math.min(85, lat));
                phi = THREE.Math.degToRad(90 - lat);
                theta = THREE.Math.degToRad(lon);
                target.x = 500 * Math.sin(phi) * Math.cos(theta);
                target.y = 500 * Math.cos(phi);
                target.z = 500 * Math.sin(phi) * Math.sin(theta);
                camera.lookAt(target);
            }
            // controls.update();

            renderer.render(scene, camera);
        }



    },
    isPc: function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    },
    rootResize: function() {
        //orientation portrait width=750px height=1334px / WeChat width=750px height=1206px 
        var wFsize;
        //screen.width screen.height  bug !!!
        // var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width :
        //     window.innerWidth : window.innerWidth;
        // var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ?
        //     screen.height : window.innerHeight : window.innerHeight;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        if (wWidth > wHeight) {
            wFsize = wHeight / 750 * 100;
        } else {
            wFsize = wWidth / 750 * 100;
        }
        document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
    },
    eventInit: function() {
        var that = this;
        document.addEventListener('touchstart', function(e) {}, false);
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
        return that;
    },
    cssInit: function() {
        var that = this;
        var noChangeCountToEnd = 100,
            noEndTimeout = 1000;
        that.rootResize();
        window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function() {
            var interval,
                timeout,
                end,
                lastInnerWidth,
                lastInnerHeight,
                noChangeCount;
            end = function() {
                // "orientationchangeend"
                clearInterval(interval);
                clearTimeout(timeout);
                interval = null;
                timeout = null;
                that.rootResize();
            };
            interval = setInterval(function() {
                if (window.innerWidth === lastInnerWidth && window.innerHeight === lastInnerHeight) {
                    noChangeCount++;
                    if (noChangeCount === noChangeCountToEnd) {
                        // The interval resolved the issue first.
                        end();
                    }
                } else {
                    lastInnerWidth = window.innerWidth;
                    lastInnerHeight = window.innerHeight;
                    noChangeCount = 0;
                }
            });
            timeout = setTimeout(function() {
                // The timeout happened first.
                end();
            }, noEndTimeout);
        });

        return that;
    },
    init: function() {
        var that = this;
        that.cssInit().eventInit();
        that.initWebGLR();
    }
};

window.onload = function() {
    window.h5.init();
};



import Stats from 'stats.js';
showStats();

function showStats() {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    var fs = document.createElement('div');
    fs.style.position = 'absolute';
    fs.style.left = 0;
    fs.style.top = 0;
    fs.style.zIndex = 999;
    fs.appendChild(stats.domElement);
    document.body.appendChild(fs);

    function animate() {
        stats.begin();
        // monitored code goes here
        stats.end();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}