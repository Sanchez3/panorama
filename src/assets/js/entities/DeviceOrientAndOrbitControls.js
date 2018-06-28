THREE.DeviceOrientAndOrbitControls = function(object) {

    var scope = this;

    var touchX, touchY;

    var sphericalDelta = new THREE.Spherical();

    var spherical = new THREE.Spherical();

    var svector = new THREE.Vector3();

    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();

    this.object = object;

    this.object.rotation.reorder('YXZ');

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.rotateSpeed = 1.0;

    this.alphaOffset = 0; // radians

    var onDeviceOrientationChangeEvent = function(event) {

        scope.deviceOrientation = event;

    };

    var onScreenOrientationChangeEvent = function() {

        scope.screenOrientation = window.orientation || 0;

    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    var setObjectQuaternion = function() {

        var zee = new THREE.Vector3(0, 0, 1);

        var euler = new THREE.Euler();

        var q0 = new THREE.Quaternion();

        var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

        return function(quaternion, alpha, beta, gamma, orient) {

            spherical.theta += sphericalDelta.theta;

            spherical.phi += sphericalDelta.phi;

            svector.setFromSpherical(spherical);

            sphericalDelta.set(0, 0, 0);

            euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

            var evector = new THREE.Vector3();

            svector.applyEuler(euler.reorder('XYZ'));

            quaternion.setFromEuler(euler.setFromVector3(svector).reorder('YXZ')); // orient the device

            quaternion.multiply(q1); // camera looks out the back of the device, not the top

            quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation

        };

    }();

    var onDocumentTouchStart = function() {

        return function(event) {

            event.preventDefault();

            var touch = event.touches[0];

            rotateStart.set(touch.pageX, touch.pageY);
        };

    }();

    var onDocumentTouchMove = function() {

        return function(event) {

            event.preventDefault();

            var touch = event.touches[0];

            rotateEnd.set(touch.pageX, touch.pageY);

            rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
            console.log(rotateDelta)

            sphericalDelta.theta -= rotateDelta.x * 2 * Math.PI / window.innerWidth;

            sphericalDelta.phi += rotateDelta.y * 2 * Math.PI / window.innerHeight;

            rotateStart.copy(rotateEnd);

        };

    }();

    this.connect = function() {

        onScreenOrientationChangeEvent(); // run once on load

        window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);

        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

        document.addEventListener('touchstart', onDocumentTouchStart, { passive: false });

        document.addEventListener('touchmove', onDocumentTouchMove, { passive: false });

        scope.enabled = true;

    };

    this.disconnect = function() {

        window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);

        window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

        scope.enabled = false;

    };

    this.update = function() {

        if (scope.enabled === false) return;

        var device = scope.deviceOrientation;

        if (device) {

            var alpha = device.alpha ? THREE.Math.degToRad(device.alpha) + scope.alphaOffset : 0; // Z

            var beta = device.beta ? THREE.Math.degToRad(device.beta) : 0; // X'

            var gamma = device.gamma ? THREE.Math.degToRad(device.gamma) : 0; // Y''

            var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O

            setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);



        }


    };

    this.dispose = function() {

        scope.disconnect();

    };

    this.connect();

};