var FixedKeyControl = require('../../../src/cameras/controls/FixedKeyControl');

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

describe('FixedKeyControl', function ()
{
    describe('constructor', function ()
    {
        it('should create with default values when given empty config', function ()
        {
            var ctrl = new FixedKeyControl({});
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
            expect(ctrl.speedX).toBe(0);
            expect(ctrl.speedY).toBe(0);
            expect(ctrl.active).toBe(false);
        });

        it('should set active to false when no camera is provided', function ()
        {
            var ctrl = new FixedKeyControl({});
            expect(ctrl.active).toBe(false);
        });

        it('should set active to true when a camera is provided', function ()
        {
            var ctrl = new FixedKeyControl({ camera: makeCamera() });
            expect(ctrl.active).toBe(true);
        });

        it('should assign camera from config', function ()
        {
            var cam = makeCamera();
            var ctrl = new FixedKeyControl({ camera: cam });
            expect(ctrl.camera).toBe(cam);
        });

        it('should assign key references from config', function ()
        {
            var left = makeKey();
            var right = makeKey();
            var up = makeKey();
            var down = makeKey();
            var zoomIn = makeKey();
            var zoomOut = makeKey();
            var ctrl = new FixedKeyControl({ left: left, right: right, up: up, down: down, zoomIn: zoomIn, zoomOut: zoomOut });
            expect(ctrl.left).toBe(left);
            expect(ctrl.right).toBe(right);
            expect(ctrl.up).toBe(up);
            expect(ctrl.down).toBe(down);
            expect(ctrl.zoomIn).toBe(zoomIn);
            expect(ctrl.zoomOut).toBe(zoomOut);
        });

        it('should set speedX and speedY from numeric speed', function ()
        {
            var ctrl = new FixedKeyControl({ speed: 5 });
            expect(ctrl.speedX).toBe(5);
            expect(ctrl.speedY).toBe(5);
        });

        it('should set speedX and speedY from speed object', function ()
        {
            var ctrl = new FixedKeyControl({ speed: { x: 3, y: 7 } });
            expect(ctrl.speedX).toBe(3);
            expect(ctrl.speedY).toBe(7);
        });

        it('should default speedX and speedY to 0 when speed is null', function ()
        {
            var ctrl = new FixedKeyControl({ speed: null });
            expect(ctrl.speedX).toBe(0);
            expect(ctrl.speedY).toBe(0);
        });

        it('should apply custom zoomSpeed, minZoom, maxZoom from config', function ()
        {
            var ctrl = new FixedKeyControl({ zoomSpeed: 0.05, minZoom: 0.5, maxZoom: 10 });
            expect(ctrl.zoomSpeed).toBe(0.05);
            expect(ctrl.minZoom).toBe(0.5);
            expect(ctrl.maxZoom).toBe(10);
        });
    });

    describe('start', function ()
    {
        it('should return this', function ()
        {
            var ctrl = new FixedKeyControl({ camera: makeCamera() });
            expect(ctrl.start()).toBe(ctrl);
        });

        it('should set active to true when camera is set', function ()
        {
            var ctrl = new FixedKeyControl({ camera: makeCamera() });
            ctrl.active = false;
            ctrl.start();
            expect(ctrl.active).toBe(true);
        });

        it('should leave active false when no camera is set', function ()
        {
            var ctrl = new FixedKeyControl({});
            ctrl.start();
            expect(ctrl.active).toBe(false);
        });
    });

    describe('stop', function ()
    {
        it('should return this', function ()
        {
            var ctrl = new FixedKeyControl({ camera: makeCamera() });
            expect(ctrl.stop()).toBe(ctrl);
        });

        it('should set active to false', function ()
        {
            var ctrl = new FixedKeyControl({ camera: makeCamera() });
            expect(ctrl.active).toBe(true);
            ctrl.stop();
            expect(ctrl.active).toBe(false);
        });
    });

    describe('setCamera', function ()
    {
        it('should return this', function ()
        {
            var ctrl = new FixedKeyControl({});
            expect(ctrl.setCamera(makeCamera())).toBe(ctrl);
        });

        it('should assign the camera', function ()
        {
            var ctrl = new FixedKeyControl({});
            var cam = makeCamera();
            ctrl.setCamera(cam);
            expect(ctrl.camera).toBe(cam);
        });

        it('should replace an existing camera', function ()
        {
            var cam1 = makeCamera();
            var cam2 = makeCamera();
            var ctrl = new FixedKeyControl({ camera: cam1 });
            ctrl.setCamera(cam2);
            expect(ctrl.camera).toBe(cam2);
        });
    });

    describe('update', function ()
    {
        it('should do nothing when not active', function ()
        {
            var cam = makeCamera(100, 100, 1);
            var ctrl = new FixedKeyControl({ camera: cam, speed: 1 });
            ctrl.stop();
            ctrl.update(16);
            expect(cam.scrollX).toBe(100);
            expect(cam.scrollY).toBe(100);
        });

        it('should scroll camera up when up key is down', function ()
        {
            var cam = makeCamera(0, 100, 1);
            var ctrl = new FixedKeyControl({ camera: cam, up: makeKey(true), speed: 1 });
            ctrl.update(10);
            expect(cam.scrollY).toBe(90);
        });

        it('should scroll camera down when down key is down', function ()
        {
            var cam = makeCamera(0, 100, 1);
            var ctrl = new FixedKeyControl({ camera: cam, down: makeKey(true), speed: 1 });
            ctrl.update(10);
            expect(cam.scrollY).toBe(110);
        });

        it('should scroll camera left when left key is down', function ()
        {
            var cam = makeCamera(100, 0, 1);
            var ctrl = new FixedKeyControl({ camera: cam, left: makeKey(true), speed: 1 });
            ctrl.update(10);
            expect(cam.scrollX).toBe(90);
        });

        it('should scroll camera right when right key is down', function ()
        {
            var cam = makeCamera(100, 0, 1);
            var ctrl = new FixedKeyControl({ camera: cam, right: makeKey(true), speed: 1 });
            ctrl.update(10);
            expect(cam.scrollX).toBe(110);
        });

        it('should not move when no keys are down', function ()
        {
            var cam = makeCamera(50, 50, 1);
            var ctrl = new FixedKeyControl({ camera: cam, up: makeKey(false), down: makeKey(false), left: makeKey(false), right: makeKey(false), speed: 5 });
            ctrl.update(16);
            expect(cam.scrollX).toBe(50);
            expect(cam.scrollY).toBe(50);
        });

        it('should prefer up over down when both are pressed', function ()
        {
            var cam = makeCamera(0, 100, 1);
            var ctrl = new FixedKeyControl({ camera: cam, up: makeKey(true), down: makeKey(true), speed: 1 });
            ctrl.update(10);
            expect(cam.scrollY).toBe(90);
        });

        it('should prefer left over right when both are pressed', function ()
        {
            var cam = makeCamera(100, 0, 1);
            var ctrl = new FixedKeyControl({ camera: cam, left: makeKey(true), right: makeKey(true), speed: 1 });
            ctrl.update(10);
            expect(cam.scrollX).toBe(90);
        });

        it('should zoom in when zoomIn key is down', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new FixedKeyControl({ camera: cam, zoomIn: makeKey(true), zoomSpeed: 0.1 });
            ctrl.update(16);
            expect(cam.zoom).toBeCloseTo(0.9);
        });

        it('should zoom out when zoomOut key is down', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new FixedKeyControl({ camera: cam, zoomOut: makeKey(true), zoomSpeed: 0.1 });
            ctrl.update(16);
            expect(cam.zoom).toBeCloseTo(1.1);
        });

        it('should clamp zoom to minZoom when zooming in past minimum', function ()
        {
            var cam = makeCamera(0, 0, 0.002);
            var ctrl = new FixedKeyControl({ camera: cam, zoomIn: makeKey(true), zoomSpeed: 0.01, minZoom: 0.001 });
            ctrl.update(16);
            expect(cam.zoom).toBe(0.001);
        });

        it('should clamp zoom to maxZoom when zooming out past maximum', function ()
        {
            var cam = makeCamera(0, 0, 999.995);
            var ctrl = new FixedKeyControl({ camera: cam, zoomOut: makeKey(true), zoomSpeed: 0.01, maxZoom: 1000 });
            ctrl.update(16);
            expect(cam.zoom).toBe(1000);
        });

        it('should use delta of 1 when delta is undefined', function ()
        {
            var cam = makeCamera(0, 100, 1);
            var ctrl = new FixedKeyControl({ camera: cam, up: makeKey(true), speed: 5 });
            ctrl.update(undefined);
            expect(cam.scrollY).toBe(95);
        });

        it('should scale scroll by delta time', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new FixedKeyControl({ camera: cam, right: makeKey(true), speed: 2 });
            ctrl.update(20);
            expect(cam.scrollX).toBe(40);
        });

        it('should floor the pixel movement (bitwise or 0)', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new FixedKeyControl({ camera: cam, right: makeKey(true), speed: { x: 1, y: 1 } });
            ctrl.update(3);
            // 1 * 3 = 3, floored = 3
            expect(cam.scrollX).toBe(3);
        });

        it('should handle fractional speed correctly via floor', function ()
        {
            var cam = makeCamera(0, 0, 1);
            var ctrl = new FixedKeyControl({ camera: cam, down: makeKey(true), speed: { x: 0, y: 0.5 } });
            ctrl.update(3);
            // 0.5 * 3 = 1.5, floored to 1
            expect(cam.scrollY).toBe(1);
        });
    });

    describe('destroy', function ()
    {
        it('should null out camera and key references', function ()
        {
            var ctrl = new FixedKeyControl({
                camera: makeCamera(),
                left: makeKey(),
                right: makeKey(),
                up: makeKey(),
                down: makeKey(),
                zoomIn: makeKey(),
                zoomOut: makeKey()
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
