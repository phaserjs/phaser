var RotateTo = require('../../../../src/cameras/2d/effects/RotateTo');
var Events = require('../../../../src/cameras/2d/events');

function createCamera ()
{
    return {
        rotation: 0,
        scene: { sys: {} },
        emit: vi.fn()
    };
}

describe('RotateTo', function ()
{
    var camera;
    var effect;

    beforeEach(function ()
    {
        camera = createCamera();
        effect = new RotateTo(camera);
    });

    describe('Constructor', function ()
    {
        it('should assign the camera reference', function ()
        {
            expect(effect.camera).toBe(camera);
        });

        it('should default isRunning to false', function ()
        {
            expect(effect.isRunning).toBe(false);
        });

        it('should default duration to 0', function ()
        {
            expect(effect.duration).toBe(0);
        });

        it('should default source to 0', function ()
        {
            expect(effect.source).toBe(0);
        });

        it('should default current to 0', function ()
        {
            expect(effect.current).toBe(0);
        });

        it('should default destination to 0', function ()
        {
            expect(effect.destination).toBe(0);
        });

        it('should default progress to 0', function ()
        {
            expect(effect.progress).toBe(0);
        });

        it('should default clockwise to true', function ()
        {
            expect(effect.clockwise).toBe(true);
        });

        it('should default shortestPath to false', function ()
        {
            expect(effect.shortestPath).toBe(false);
        });
    });

    describe('start', function ()
    {
        it('should return the camera', function ()
        {
            var result = effect.start(1.0);
            expect(result).toBe(camera);
        });

        it('should set isRunning to true', function ()
        {
            effect.start(1.0);
            expect(effect.isRunning).toBe(true);
        });

        it('should set destination to the given angle', function ()
        {
            effect.start(2.5);
            expect(effect.destination).toBe(2.5);
        });

        it('should use default duration of 1000ms', function ()
        {
            effect.start(1.0);
            expect(effect.duration).toBe(1000);
        });

        it('should use the provided duration', function ()
        {
            effect.start(1.0, false, 500);
            expect(effect.duration).toBe(500);
        });

        it('should reset progress to 0', function ()
        {
            effect.progress = 0.5;
            effect.start(1.0);
            expect(effect.progress).toBe(0);
        });

        it('should set source from camera.rotation', function ()
        {
            camera.rotation = 1.2;
            effect.start(2.0);
            expect(effect.source).toBe(1.2);
        });

        it('should accept a string ease name', function ()
        {
            effect.start(1.0, false, 1000, 'Linear');
            expect(typeof effect.ease).toBe('function');
        });

        it('should accept a custom ease function', function ()
        {
            var customEase = function (v) { return v; };
            effect.start(1.0, false, 1000, customEase);
            expect(effect.ease).toBe(customEase);
        });

        it('should emit ROTATE_START event', function ()
        {
            effect.start(1.0, false, 500);
            expect(camera.emit).toHaveBeenCalledWith(
                Events.ROTATE_START,
                camera,
                effect,
                500,
                1.0
            );
        });

        it('should set clockwise true when destination >= source', function ()
        {
            camera.rotation = 0;
            effect.start(1.0);
            expect(effect.clockwise).toBe(true);
        });

        it('should set clockwise false when destination < source', function ()
        {
            camera.rotation = 2.0;
            effect.start(1.0);
            expect(effect.clockwise).toBe(false);
        });

        it('should not restart if already running and force is false', function ()
        {
            effect.start(1.0, false, 1000);
            camera.emit.mockClear();
            effect.start(2.0, false, 500);
            expect(effect.destination).toBe(1.0);
            expect(camera.emit).not.toHaveBeenCalled();
        });

        it('should restart if already running and force is true', function ()
        {
            effect.start(1.0, false, 1000);
            camera.emit.mockClear();
            effect.start(2.0, false, 500, 'Linear', true);
            expect(effect.destination).toBe(2.0);
            expect(effect.duration).toBe(500);
            expect(camera.emit).toHaveBeenCalled();
        });

        it('should set shortestPath flag', function ()
        {
            effect.start(1.0, true);
            expect(effect.shortestPath).toBe(true);
        });

        it('should store a callback', function ()
        {
            var cb = function () {};
            effect.start(1.0, false, 1000, 'Linear', false, cb);
            expect(effect._onUpdate).toBe(cb);
        });

        it('should default shortestPath to false when undefined', function ()
        {
            effect.start(1.0);
            expect(effect.shortestPath).toBe(false);
        });

        it('should handle negative destination angle', function ()
        {
            camera.rotation = 0;
            effect.start(-1.0);
            expect(effect.destination).toBe(-1.0);
            expect(effect.clockwise).toBe(false);
        });
    });

    describe('update', function ()
    {
        it('should do nothing if not running', function ()
        {
            camera.rotation = 0;
            effect.update(0, 100);
            expect(camera.rotation).toBe(0);
        });

        it('should increment elapsed time', function ()
        {
            effect.start(1.0, false, 1000);
            effect._elapsed = 0;
            effect.update(0, 200);
            expect(effect._elapsed).toBe(200);
        });

        it('should update camera rotation during effect', function ()
        {
            camera.rotation = 0;
            effect.start(1.0, false, 1000);
            effect.update(0, 500);
            expect(camera.rotation).toBeGreaterThan(0);
            expect(camera.rotation).toBeLessThan(1.0);
        });

        it('should update progress during effect', function ()
        {
            effect.start(1.0, false, 1000);
            effect.update(0, 500);
            expect(effect.progress).toBeCloseTo(0.5);
        });

        it('should clamp progress to 1 at completion', function ()
        {
            effect.start(1.0, false, 1000);
            effect.update(0, 1500);
            expect(effect.progress).toBe(1);
        });

        it('should set camera rotation to destination when complete', function ()
        {
            camera.rotation = 0;
            effect.start(1.0, false, 1000);
            effect.update(0, 1000);
            expect(camera.rotation).toBe(1.0);
        });

        it('should set isRunning to false when complete', function ()
        {
            effect.start(1.0, false, 1000);
            effect.update(0, 1000);
            expect(effect.isRunning).toBe(false);
        });

        it('should call onUpdate callback during progress', function ()
        {
            var cb = vi.fn();
            effect.start(1.0, false, 1000, 'Linear', false, cb);
            effect.update(0, 500);
            expect(cb).toHaveBeenCalled();
        });

        it('should call onUpdate callback with camera, progress, and rotation', function ()
        {
            var cb = vi.fn();
            effect.start(1.0, false, 1000, 'Linear', false, cb);
            effect.update(0, 500);
            var args = cb.mock.calls[0];
            expect(args[0]).toBe(camera);
            expect(args[1]).toBeCloseTo(0.5);
            expect(typeof args[2]).toBe('number');
        });

        it('should call onUpdate at completion', function ()
        {
            var cb = vi.fn();
            effect.start(1.0, false, 1000, 'Linear', false, cb);
            effect.update(0, 1000);
            expect(cb).toHaveBeenCalled();
        });

        it('should emit ROTATE_COMPLETE when effect finishes', function ()
        {
            effect.start(1.0, false, 1000);
            camera.emit.mockClear();
            effect.update(0, 1000);
            expect(camera.emit).toHaveBeenCalledWith(Events.ROTATE_COMPLETE, camera, effect);
        });

        it('should update current property during progress', function ()
        {
            camera.rotation = 0;
            effect.start(1.0, false, 1000);
            effect.update(0, 500);
            expect(effect.current).toBeCloseTo(0.5);
        });

        it('should set current to destination when complete', function ()
        {
            effect.start(1.0, false, 1000);
            effect.update(0, 1200);
            expect(effect.current).toBe(1.0);
        });
    });

    describe('effectComplete', function ()
    {
        it('should set isRunning to false', function ()
        {
            effect.isRunning = true;
            effect.effectComplete();
            expect(effect.isRunning).toBe(false);
        });

        it('should clear _onUpdate', function ()
        {
            effect._onUpdate = function () {};
            effect.effectComplete();
            expect(effect._onUpdate).toBeNull();
        });

        it('should clear _onUpdateScope', function ()
        {
            effect._onUpdateScope = {};
            effect.effectComplete();
            expect(effect._onUpdateScope).toBeNull();
        });

        it('should emit ROTATE_COMPLETE', function ()
        {
            effect.effectComplete();
            expect(camera.emit).toHaveBeenCalledWith(Events.ROTATE_COMPLETE, camera, effect);
        });
    });

    describe('reset', function ()
    {
        it('should set isRunning to false', function ()
        {
            effect.isRunning = true;
            effect.reset();
            expect(effect.isRunning).toBe(false);
        });

        it('should clear _onUpdate', function ()
        {
            effect._onUpdate = function () {};
            effect.reset();
            expect(effect._onUpdate).toBeNull();
        });

        it('should clear _onUpdateScope', function ()
        {
            effect._onUpdateScope = {};
            effect.reset();
            expect(effect._onUpdateScope).toBeNull();
        });

        it('should not emit any events', function ()
        {
            effect.isRunning = true;
            camera.emit.mockClear();
            effect.reset();
            expect(camera.emit).not.toHaveBeenCalled();
        });
    });

    describe('destroy', function ()
    {
        it('should set camera to null', function ()
        {
            effect.destroy();
            expect(effect.camera).toBeNull();
        });

        it('should set source to null', function ()
        {
            effect.destroy();
            expect(effect.source).toBeNull();
        });

        it('should set destination to null', function ()
        {
            effect.destroy();
            expect(effect.destination).toBeNull();
        });

        it('should set isRunning to false', function ()
        {
            effect.isRunning = true;
            effect.destroy();
            expect(effect.isRunning).toBe(false);
        });

        it('should clear callbacks', function ()
        {
            effect._onUpdate = function () {};
            effect.destroy();
            expect(effect._onUpdate).toBeNull();
        });
    });
});
