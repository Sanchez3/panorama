THREE.DeviceMotionAndOrbitControls = function(object) {

    var scope = this;

    var touchX, touchY;

    var sphericalDelta = new THREE.Spherical();

    var spherical = new THREE.Spherical();

    scope.minPolarAngle = -Math.PI / 2; // radians
    scope.maxPolarAngle = Math.PI / 2; // radians

    var rotateStart = new THREE.Vector2(0, 0);
    var rotateEnd = new THREE.Vector2(0, 0);
    var rotateDelta = new THREE.Vector2(0, 0);

    this.object = object;

    this.object.rotation.reorder('YXZ');


    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    this.enableDamping = false;
    this.dampingFactor = 0.9;

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;
    this.deviceMotion = {};

    this.rotateSpeed = 1.0;

    this.alphaOffset = 0; // radians

    var onDeviceOrientationChangeEvent = function(event) {

        scope.deviceOrientation = event;

    };

    var onDeviceMotionChangeEvent = function(event) {
        scope.deviceMotion = event;
    }

    var onScreenMotionChangeEvent = function() {

        scope.deviceMotion = window.DeviceMotionEvent || 0;

    };


    var onScreenOrientationChangeEvent = function() {

        scope.screenOrientation = window.orientation || 0;

    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    var setObjectQuaternion = function() {

        var zee = new THREE.Vector3(0, 0, 1);

        var zee = new THREE.Vector3(0, 0, 1);

        var euler = new THREE.Euler();

        var q0 = new THREE.Quaternion();

        var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

        return function(quaternion, alpha, beta, gamma, orient) {



            // θ  Left-right
            spherical.theta += (beta * 0.01 + sphericalDelta.theta);
            // φ  Up-down
            spherical.phi += (alpha * 0.01 + sphericalDelta.phi);

            if (scope.enableDamping === true) {

                sphericalDelta.theta *= (1 - scope.dampingFactor);
                sphericalDelta.phi *= (1 - scope.dampingFactor);

            } else {

                sphericalDelta.set(0, 0, 0);


            }



            spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));

            euler.set(spherical.phi, spherical.theta, 0, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us


            quaternion.setFromEuler(euler); // orient the device


            // quaternion.multiply(q1); // camera looks out the back of the device, not the top

            quaternion.multiply(q0.setFromAxisAngle(zee, 0)); // adjust for screen orientation

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

            sphericalDelta.theta += rotateDelta.x * 2 * Math.PI / window.innerWidth;

            sphericalDelta.phi += rotateDelta.y * 2 * Math.PI / window.innerHeight;

            rotateStart.copy(rotateEnd);

        };

    }();



    this.connect = function() {

        onScreenMotionChangeEvent(); // run once on load

        window.addEventListener('devicemotion', onDeviceMotionChangeEvent, false);

        document.addEventListener('touchstart', onDocumentTouchStart, { passive: false });

        document.addEventListener('touchmove', onDocumentTouchMove, { passive: false });

        scope.enabled = true;

    };

    this.disconnect = function() {

        window.removeEventListener('devicemotion', onDeviceMotionChangeEvent, false);

        scope.enabled = false;

    };

    this.update = function() {

        if (scope.enabled === false) return;
        var device = scope.deviceMotion.rotationRate;
        // console.log(scope.deviceMotion)
        if (device) {
            var alpha = THREE.Math.degToRad(device.alpha);
            var beta = THREE.Math.degToRad(device.beta);
            setObjectQuaternion(scope.object.quaternion, alpha, beta);
        } else {
            var alpha = 0;
            var beta = 0;
            setObjectQuaternion(scope.object.quaternion, alpha, beta);
        }
    };

    this.dispose = function() {

        scope.disconnect();

    };

    this.connect();

};