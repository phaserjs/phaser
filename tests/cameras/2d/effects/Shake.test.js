var Shake = require('../../../../src/cameras/2d/effects/Shake');
var Events = require('../../../../src/cameras/2d/events');

function createMockCamera ()
{
    return {
        scene: {},
        width: 800,
        height: 600,
        zoom: 1,
        roundPixels: false,
        matrix: {
            translate: vi.fn()
        },
        emit: vi.fn()
    };
}

describe('Shake', function ()
{
    var camera;
    var shake;

    beforeEach(function ()
    {
        camera = createMockCamera();
        shake = new Shake(camera);
    });

    describe('constructor', function ()
    {
        it('should assign the camera reference', function ()
        {
            expect(shake.camera).toBe(camera);
        });

        it('should default isRunning to false', function ()
        {
            expect(shake.isRunning).toBe(false);
        });

        it('should default duration to 0', function ()
        {
            expect(shake.duration).toBe(0);
        });

        it('should default progress to 0', function ()
        {
            expect(shake.progress).toBe(0);
        });

        it('should create intensity as a Vector2 at (0, 0)', function ()
        {
            expect(shake.intensity).not.toBeNull();
            expect(shake.intensity.x).toBe(0);
            expect(shake.intensity.y).toBe(0);
        });
    });

    describe('start', function ()
    {
        it('should return the camera', function ()
        {
            var result = shake.start();
            expect(result).toBe(camera);
        });

        it('should set isRunning to true', function ()
        {
            shake.start();
            expect(shake.isRunning).toBe(true);
        });

        it('should use default duration of 100', function ()
        {
            shake.start();
            expect(shake.duration).toBe(100);
        });

        it('should use a custom duration', function ()
        {
            shake.start(500);
            expect(shake.duration).toBe(500);
        });

        it('should reset progress to 0', function ()
        {
            shake.progress = 0.5;
            shake.start();
            expect(shake.progress).toBe(0);
        });

        it('should set intensity from a number', function ()
        {
            shake.start(100, 0.1);
            expect(shake.intensity.x).toBeCloseTo(0.1);
            expect(shake.intensity.y).toBeCloseTo(0.1);
        });

        it('should use default intensity of 0.05 when not specified', function ()
        {
            shake.start(100);
            expect(shake.intensity.x).toBeCloseTo(0.05);
            expect(shake.intensity.y).toBeCloseTo(0.05);
        });

        it('should set intensity from a Vector2-like object', function ()
        {
            shake.start(100, { x: 0.2, y: 0.4 });
            expect(shake.intensity.x).toBeCloseTo(0.2);
            expect(shake.intensity.y).toBeCloseTo(0.4);
        });

        it('should emit SHAKE_START event', function ()
        {
            shake.start(200, 0.1);
            expect(camera.emit).toHaveBeenCalledWith(
                Events.SHAKE_START,
                camera,
                shake,
                200,
                0.1
            );
        });

        it('should not start if already running and force is false', function ()
        {
            shake.start(100);
            camera.emit.mockClear();
            var result = shake.start(200, 0.2, false);
            expect(result).toBe(camera);
            expect(shake.duration).toBe(100);
            expect(camera.emit).not.toHaveBeenCalled();
        });

        it('should restart if already running and force is true', function ()
        {
            shake.start(100);
            camera.emit.mockClear();
            shake.start(500, 0.3, true);
            expect(shake.duration).toBe(500);
            expect(camera.emit).toHaveBeenCalled();
        });

        it('should reset elapsed and offsets on start', function ()
        {
            shake._elapsed = 99;
            shake._offsetX = 10;
            shake._offsetY = 20;
            shake.start();
            expect(shake._elapsed).toBe(0);
            expect(shake._offsetX).toBe(0);
            expect(shake._offsetY).toBe(0);
        });

        it('should store the callback and context', function ()
        {
            var cb = vi.fn();
            var ctx = { foo: 'bar' };
            shake.start(100, 0.05, false, cb, ctx);
            expect(shake._onUpdate).toBe(cb);
            expect(shake._onUpdateScope).toBe(ctx);
        });
    });

    describe('preRender', function ()
    {
        it('should not translate the matrix when not running', function ()
        {
            shake.preRender();
            expect(camera.matrix.translate).not.toHaveBeenCalled();
        });

        it('should translate the matrix when running', function ()
        {
            shake.start();
            shake._offsetX = 5;
            shake._offsetY = -3;
            shake.preRender();
            expect(camera.matrix.translate).toHaveBeenCalledWith(5, -3);
        });

        it('should translate with zero offsets when just started', function ()
        {
            shake.start();
            shake.preRender();
            expect(camera.matrix.translate).toHaveBeenCalledWith(0, 0);
        });
    });

    describe('update', function ()
    {
        it('should do nothing when not running', function ()
        {
            shake.update(0, 100);
            expect(shake.progress).toBe(0);
        });

        it('should accumulate elapsed time', function ()
        {
            shake.start(1000);
            shake.update(0, 250);
            expect(shake._elapsed).toBeCloseTo(250);
        });

        it('should calculate progress correctly', function ()
        {
            shake.start(1000);
            shake.update(0, 500);
            expect(shake.progress).toBeCloseTo(0.5);
        });

        it('should clamp progress to 1', function ()
        {
            shake.start(100);
            shake.update(0, 200);
            expect(shake.progress).toBe(1);
        });

        it('should invoke the onUpdate callback with camera and progress', function ()
        {
            var cb = vi.fn();
            var ctx = { id: 1 };
            shake.start(1000, 0.05, false, cb, ctx);
            shake.update(0, 500);
            expect(cb).toHaveBeenCalledWith(camera, expect.any(Number));
        });

        it('should invoke onUpdate in the correct context', function ()
        {
            var ctx = { id: 42 };
            var capturedThis;
            var cb = function () { capturedThis = this; };
            shake.start(1000, 0.05, false, cb, ctx);
            shake.update(0, 100);
            expect(capturedThis).toBe(ctx);
        });

        it('should set offsets within expected bounds during shake', function ()
        {
            shake.start(1000, 0.1);
            camera.width = 800;
            camera.height = 600;
            camera.zoom = 1;

            var maxOffsetX = 0.1 * 800 * 1;
            var maxOffsetY = 0.1 * 600 * 1;

            for (var i = 0; i < 50; i++)
            {
                shake.update(0, 10);
                expect(shake._offsetX).toBeGreaterThanOrEqual(-maxOffsetX);
                expect(shake._offsetX).toBeLessThanOrEqual(maxOffsetX);
                expect(shake._offsetY).toBeGreaterThanOrEqual(-maxOffsetY);
                expect(shake._offsetY).toBeLessThanOrEqual(maxOffsetY);
            }
        });

        it('should scale offsets by camera zoom', function ()
        {
            shake.start(1000, 0.1);
            camera.zoom = 2;
            camera.width = 100;
            camera.height = 100;

            var maxOffset = 0.1 * 100 * 2;

            for (var i = 0; i < 30; i++)
            {
                shake.update(0, 10);
                expect(Math.abs(shake._offsetX)).toBeLessThanOrEqual(maxOffset + 0.0001);
                expect(Math.abs(shake._offsetY)).toBeLessThanOrEqual(maxOffset + 0.0001);
            }
        });

        it('should round offsets when roundPixels is true', function ()
        {
            camera.roundPixels = true;
            shake.start(1000, 0.1);

            for (var i = 0; i < 20; i++)
            {
                shake.update(0, 10);
                expect(shake._offsetX).toBe(Math.round(shake._offsetX));
                expect(shake._offsetY).toBe(Math.round(shake._offsetY));
            }
        });

        it('should call effectComplete when elapsed exceeds duration', function ()
        {
            shake.start(100);
            var spy = vi.spyOn(shake, 'effectComplete');
            shake.update(0, 200);
            expect(spy).toHaveBeenCalled();
        });

        it('should not set offsets once elapsed exceeds duration', function ()
        {
            shake.start(100);
            shake.update(0, 200);
            expect(shake._offsetX).toBe(0);
            expect(shake._offsetY).toBe(0);
        });
    });

    describe('effectComplete', function ()
    {
        it('should set isRunning to false', function ()
        {
            shake.isRunning = true;
            shake.effectComplete();
            expect(shake.isRunning).toBe(false);
        });

        it('should reset offsets to zero', function ()
        {
            shake._offsetX = 10;
            shake._offsetY = -5;
            shake.effectComplete();
            expect(shake._offsetX).toBe(0);
            expect(shake._offsetY).toBe(0);
        });

        it('should clear the onUpdate callback', function ()
        {
            shake._onUpdate = vi.fn();
            shake.effectComplete();
            expect(shake._onUpdate).toBeNull();
        });

        it('should clear the onUpdateScope', function ()
        {
            shake._onUpdateScope = { foo: 'bar' };
            shake.effectComplete();
            expect(shake._onUpdateScope).toBeNull();
        });

        it('should emit SHAKE_COMPLETE event', function ()
        {
            shake.effectComplete();
            expect(camera.emit).toHaveBeenCalledWith(
                Events.SHAKE_COMPLETE,
                camera,
                shake
            );
        });
    });

    describe('reset', function ()
    {
        it('should set isRunning to false', function ()
        {
            shake.isRunning = true;
            shake.reset();
            expect(shake.isRunning).toBe(false);
        });

        it('should reset offsets to zero', function ()
        {
            shake._offsetX = 15;
            shake._offsetY = -8;
            shake.reset();
            expect(shake._offsetX).toBe(0);
            expect(shake._offsetY).toBe(0);
        });

        it('should clear the onUpdate callback', function ()
        {
            shake._onUpdate = vi.fn();
            shake.reset();
            expect(shake._onUpdate).toBeNull();
        });

        it('should clear the onUpdateScope', function ()
        {
            shake._onUpdateScope = {};
            shake.reset();
            expect(shake._onUpdateScope).toBeNull();
        });

        it('should not emit any camera events', function ()
        {
            shake.start(100);
            camera.emit.mockClear();
            shake.reset();
            expect(camera.emit).not.toHaveBeenCalled();
        });
    });

    describe('destroy', function ()
    {
        it('should set camera to null', function ()
        {
            shake.destroy();
            expect(shake.camera).toBeNull();
        });

        it('should set intensity to null', function ()
        {
            shake.destroy();
            expect(shake.intensity).toBeNull();
        });

        it('should stop the effect', function ()
        {
            shake.isRunning = true;
            shake.destroy();
            expect(shake.isRunning).toBe(false);
        });

        it('should not emit any events', function ()
        {
            shake.start(100);
            camera.emit.mockClear();
            shake.destroy();
            expect(camera.emit).not.toHaveBeenCalled();
        });
    });
});
