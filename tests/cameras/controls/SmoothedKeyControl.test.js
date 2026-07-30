var SmoothedKeyControl = require('../../../src/cameras/controls/SmoothedKeyControl');

describe('SmoothedKeyControl', function ()
{
    function makeCamera (scrollX, scrollY, zoom)
    {
        return {
            scrollX: scrollX || 0,
            scrollY: scrollY || 0,
            zoom: zoom || 1
        };
    }

    function makeKey (isDown)
    {
        return { isDown: !!isDown };
    }

    describe('constructor', function ()
    {
        it('should create with default values when given empty config', function ()
        {
            var ctrl = new SmoothedKeyControl({});

            expect(ctrl.camera).toBeNull();
            expect(ctrl.left).toBeNull();
            expect(ctrl.right).toBeNull();
            expect(ctrl.up).toBeNull();
            expect(ctrl.down).toBeNull();
            expect(ctrl.zoomIn).toBeNull();
            expect(ctrl.zoomOut).toBeNull();
            expect(ctrl.zoomSpeed).toBe(0.01);
            expect(ctrl.minZoom).toBe(0.001);
            expect(ctrl.maxZoom).toBe(1000);
            expect(ctrl.accelX).toBe(0);
            expect(ctrl.accelY).toBe(0);
            expect(ctrl.dragX).toBe(0);
            expect(ctrl.dragY).toBe(0);
            expect(ctrl.maxSpeedX).toBe(0);
            expect(ctrl.maxSpeedY).toBe(0);
            expect(ctrl.active).toBe(false);
        });

        it('should set active to true when a camera is provided', function ()
        {
            var ctrl = new SmoothedKeyControl({ camera: makeCamera() });

            expect(ctrl.active).toBe(true);
        });

        it('should set active to false when no camera is provided', function ()
        {
            var ctrl = new SmoothedKeyControl({});

            expect(ctrl.active).toBe(false);
        });

        it('should assign key objects from config', function ()
        {
            var left = makeKey(false);
            var right = makeKey(false);
            var up = makeKey(false);
            var down = makeKey(false);
            var zoomIn = makeKey(false);
            var zoomOut = makeKey(false);

            var ctrl = new SmoothedKeyControl({
                left: left,
                right: right,
                up: up,
                down: down,
                zoomIn: zoomIn,
                zoomOut: zoomOut
            });

            expect(ctrl.left).toBe(left);
            expect(ctrl.right).toBe(right);
            expect(ctrl.up).toBe(up);
            expect(ctrl.down).toBe(down);
            expect(ctrl.zoomIn).toBe(zoomIn);
            expect(ctrl.zoomOut).toBe(zoomOut);
        });

        it('should set zoomSpeed, minZoom, maxZoom from config', function ()
        {
            var ctrl = new SmoothedKeyControl({ zoomSpeed: 0.05, minZoom: 0.5, maxZoom: 4 });

            expect(ctrl.zoomSpeed).toBe(0.05);
            expect(ctrl.minZoom).toBe(0.5);
            expect(ctrl.maxZoom).toBe(4);
        });

        it('should apply scalar acceleration to both axes', function ()
        {
            var ctrl = new SmoothedKeyControl({ acceleration: 0.06 });

            expect(ctrl.accelX).toBe(0.06);
            expect(ctrl.accelY).toBe(0.06);
        });

        it('should apply object acceleration to individual axes', function ()
        {
            var ctrl = new SmoothedKeyControl({ acceleration: { x: 0.1, y: 0.2 } });

            expect(ctrl.accelX).toBe(0.1);
            expect(ctrl.accelY).toBe(0.2);
        });

        it('should apply scalar drag to both axes', function ()
        {
            var ctrl = new SmoothedKeyControl({ drag: 0.0005 });

            expect(ctrl.dragX).toBe(0.0005);
            expect(ctrl.dragY).toBe(0.0005);
        });

        it('should apply object drag to individual axes', function ()
        {
            var ctrl = new SmoothedKeyControl({ drag: { x: 0.001, y: 0.002 } });

            expect(ctrl.dragX).toBe(0.001);
            expect(ctrl.dragY).toBe(0.002);
        });

        it('should apply scalar maxSpeed to both axes', function ()
        {
            var ctrl = new SmoothedKeyControl({ maxSpeed: 1.0 });

            expect(ctrl.maxSpeedX).toBe(1.0);
            expect(ctrl.maxSpeedY).toBe(1.0);
        });

        it('should apply object maxSpeed to individual axes', function ()
        {
            var ctrl = new SmoothedKeyControl({ maxSpeed: { x: 2.0, y: 3.0 } });

            expect(ctrl.maxSpeedX).toBe(2.0);
            expect(ctrl.maxSpeedY).toBe(3.0);
        });
    });

    describe('start', function ()
    {
        it('should return this for chaining', function ()
        {
            var ctrl = new SmoothedKeyControl({});

            expect(ctrl.start()).toBe(ctrl);
        });

        it('should set active true when camera is set', function ()
        {
            var ctrl = new SmoothedKeyControl({ camera: makeCamera() });
            ctrl.active = false;
            ctrl.start();

            expect(ctrl.active).toBe(true);
        });

        it('should leave active false when no camera is set', function ()
        {
            var ctrl = new SmoothedKeyControl({});
            ctrl.start();

            expect(ctrl.active).toBe(false);
        });
    });

    describe('stop', function ()
    {
        it('should return this for chaining', function ()
        {
            var ctrl = new SmoothedKeyControl({});

            expect(ctrl.stop()).toBe(ctrl);
        });

        it('should set active to false', function ()
        {
            var ctrl = new SmoothedKeyControl({ camera: makeCamera() });

            expect(ctrl.active).toBe(true);

            ctrl.stop();

            expect(ctrl.active).toBe(false);
        });
    });

    describe('setCamera', function ()
    {
        it('should return this for chaining', function ()
        {
            var ctrl = new SmoothedKeyControl({});

            expect(ctrl.setCamera(makeCamera())).toBe(ctrl);
        });

        it('should assign the camera', function ()
        {
            var ctrl = new SmoothedKeyControl({});
            var cam = makeCamera();
            ctrl.setCamera(cam);

            expect(ctrl.camera).toBe(cam);
        });

        it('should replace an existing camera', function ()
        {
            var cam1 = makeCamera();
            var cam2 = makeCamera();
            var ctrl = new SmoothedKeyControl({ camera: cam1 });
            ctrl.setCamera(cam2);

            expect(ctrl.camera).toBe(cam2);
        });
    });

    describe('update', function ()
    {
        it('should do nothing when inactive', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({ camera: cam });
            ctrl.stop();
            ctrl.update(16);

            expect(cam.scrollX).toBe(0);
            expect(cam.scrollY).toBe(0);
            expect(cam.zoom).toBe(1);
        });

        it('should do nothing when no keys are pressed and speed is zero', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({ camera: cam, acceleration: 0.1, drag: 0.001, maxSpeed: 1 });
            ctrl.update(16);

            expect(cam.scrollX).toBe(0);
            expect(cam.scrollY).toBe(0);
            expect(cam.zoom).toBe(1);
        });

        it('should accelerate camera scroll when left key is held', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                left: makeKey(true),
                acceleration: 0.5,
                drag: 0,
                maxSpeed: 10
            });

            ctrl.update(16);

            expect(cam.scrollX).toBeLessThan(0);
        });

        it('should accelerate camera scroll when right key is held', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                right: makeKey(true),
                acceleration: 0.5,
                drag: 0,
                maxSpeed: 10
            });

            ctrl.update(16);

            expect(cam.scrollX).toBeGreaterThan(0);
        });

        it('should accelerate camera scroll when up key is held', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                up: makeKey(true),
                acceleration: 0.5,
                drag: 0,
                maxSpeed: 10
            });

            ctrl.update(16);

            expect(cam.scrollY).toBeLessThan(0);
        });

        it('should accelerate camera scroll when down key is held', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                down: makeKey(true),
                acceleration: 0.5,
                drag: 0,
                maxSpeed: 10
            });

            ctrl.update(16);

            expect(cam.scrollY).toBeGreaterThan(0);
        });

        it('should not exceed maxSpeedX when left key is held', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                left: makeKey(true),
                acceleration: 5,
                drag: 0,
                maxSpeed: 2
            });

            // Run many frames to try to exceed maxSpeed
            for (var i = 0; i < 100; i++)
            {
                ctrl.update(16);
            }

            expect(ctrl._speedX).toBeLessThanOrEqual(2);
        });

        it('should not exceed maxSpeedY when down key is held', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                down: makeKey(true),
                acceleration: 5,
                drag: 0,
                maxSpeed: 2
            });

            for (var i = 0; i < 100; i++)
            {
                ctrl.update(16);
            }

            expect(ctrl._speedY).toBeGreaterThanOrEqual(-2);
        });

        it('should apply drag to decelerate _speedX over time', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                drag: 0.1,
                maxSpeed: 10,
                acceleration: 0
            });

            // Manually set internal speed
            ctrl._speedX = 5;
            ctrl.update(10);

            expect(ctrl._speedX).toBeLessThan(5);
            expect(ctrl._speedX).toBeGreaterThanOrEqual(0);
        });

        it('should apply drag to decelerate negative _speedX over time', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                drag: 0.1,
                maxSpeed: 10,
                acceleration: 0
            });

            ctrl._speedX = -5;
            ctrl.update(10);

            expect(ctrl._speedX).toBeGreaterThan(-5);
            expect(ctrl._speedX).toBeLessThanOrEqual(0);
        });

        it('should clamp _speedX to zero when drag exceeds remaining speed', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                drag: 100,
                maxSpeed: 10,
                acceleration: 0
            });

            ctrl._speedX = 0.001;
            ctrl.update(1);

            expect(ctrl._speedX).toBe(0);
        });

        it('should zoom in when zoomIn key is held', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                zoomIn: makeKey(true),
                zoomSpeed: 0.1
            });

            ctrl.update(16);

            expect(cam.zoom).toBeLessThan(1);
        });

        it('should zoom out when zoomOut key is held', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                zoomOut: makeKey(true),
                zoomSpeed: 0.1
            });

            ctrl.update(16);

            expect(cam.zoom).toBeGreaterThan(1);
        });

        it('should not zoom below minZoom', function ()
        {
            var cam = makeCamera(0, 0, 0.002);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                zoomIn: makeKey(true),
                zoomSpeed: 0.1,
                minZoom: 0.001
            });

            for (var i = 0; i < 100; i++)
            {
                ctrl.update(16);
            }

            expect(cam.zoom).toBeGreaterThanOrEqual(0.001);
        });

        it('should not zoom above maxZoom', function ()
        {
            var cam = makeCamera(0, 0, 999);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                zoomOut: makeKey(true),
                zoomSpeed: 0.1,
                maxZoom: 1000
            });

            for (var i = 0; i < 100; i++)
            {
                ctrl.update(16);
            }

            expect(cam.zoom).toBeLessThanOrEqual(1000);
        });

        it('should not change zoom when neither zoomIn nor zoomOut is pressed', function ()
        {
            var cam = makeCamera(0, 0, 2);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                zoomIn: makeKey(false),
                zoomOut: makeKey(false),
                zoomSpeed: 0.1
            });

            ctrl.update(16);

            expect(cam.zoom).toBe(2);
        });

        it('should default delta to 1 when called with no argument', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new SmoothedKeyControl({
                camera: cam,
                left: makeKey(true),
                acceleration: 2,
                drag: 0,
                maxSpeed: 10
            });

            // Should not throw and should move the camera
            ctrl.update();

            // _speedX should have been set, and scrollX adjusted
            expect(cam.scrollX).toBeLessThan(0);
        });
    });

    describe('destroy', function ()
    {
        it('should null out camera and key references', function ()
        {
            var ctrl = new SmoothedKeyControl({
                camera: makeCamera(),
                left: makeKey(false),
                right: makeKey(false),
                up: makeKey(false),
                down: makeKey(false),
                zoomIn: makeKey(false),
                zoomOut: makeKey(false)
            });

            ctrl.destroy();

            expect(ctrl.camera).toBeNull();
            expect(ctrl.left).toBeNull();
            expect(ctrl.right).toBeNull();
            expect(ctrl.up).toBeNull();
            expect(ctrl.down).toBeNull();
            expect(ctrl.zoomIn).toBeNull();
            expect(ctrl.zoomOut).toBeNull();
        });
    });
});
