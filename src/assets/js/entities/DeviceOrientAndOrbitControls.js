THREE.DeviceOrientAndOrbitControls = function(object) {

    var scope = this;

    var touchX, touchY;
    var lon = 90,
        lat = 0;

    this.object = object;
    this.object.rotation.reorder('YXZ');

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

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
        var beuler = new THREE.Euler();
        beuler.order = 'YXZ'

        var q0 = new THREE.Quaternion();

        var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

        return function(quaternion, alpha, beta, gamma, orient) {

            var b = new THREE.Vector3(lat, lon, 0);

            euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

            beuler.setFromVector3(b);

            euler.x += beuler.x;
            euler.y += beuler.y;
            euler.z += beuler.z;
            quaternion.setFromEuler(euler); // orient the device

            quaternion.multiply(q1); // camera looks out the back of the device, not the top

            quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation

        };

    }();

    var onDocumentTouchStart = function() {

        return function(event) {

            event.preventDefault();

            var touch = event.touches[0];

            touchX = touch.screenX;

            touchY = touch.screenY;

        };

    }();

    var onDocumentTouchMove = function() {

        return function(event) {

            event.preventDefault();

            var touch = event.touches[0];

            lon -= (touch.screenX - touchX) * 0.1;

            lat += (touch.screenY - touchY) * 0.1;

            touchX = touch.screenX;

            touchY = touch.screenY;

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