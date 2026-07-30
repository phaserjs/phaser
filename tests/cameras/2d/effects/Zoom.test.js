var Zoom = require('../../../../src/cameras/2d/effects/Zoom');

function createMockCamera ()
{
    return {
        zoom: 1,
        scene: {},
        emit: vi.fn()
    };
}

describe('Zoom', function ()
{
    var camera;
    var zoom;

    beforeEach(function ()
    {
        camera = createMockCamera();
        zoom = new Zoom(camera);
    });

    describe('Constructor', function ()
    {
        it('should assign the camera reference', function ()
        {
            expect(zoom.camera).toBe(camera);
        });

        it('should default isRunning to false', function ()
        {
            expect(zoom.isRunning).toBe(false);
        });

        it('should default duration to 0', function ()
        {
            expect(zoom.duration).toBe(0);
        });

        it('should default source to 1', function ()
        {
            expect(zoom.source).toBe(1);
        });

        it('should default destination to 1', function ()
        {
            expect(zoom.destination).toBe(1);
        });

        it('should default progress to 0', function ()
        {
            expect(zoom.progress).toBe(0);
        });
    });

    describe('start', function ()
    {
        it('should set isRunning to true', function ()
        {
            zoom.start(2);
            expect(zoom.isRunning).toBe(true);
        });

        it('should set the destination zoom value', function ()
        {
            zoom.start(3);
            expect(zoom.destination).toBe(3);
        });

        it('should default duration to 1000', function ()
        {
            zoom.start(2);
            expect(zoom.duration).toBe(1000);
        });

        it('should accept a custom duration', function ()
        {
            zoom.start(2, 500);
            expect(zoom.duration).toBe(500);
        });

        it('should reset progress to 0 when started', function ()
        {
            zoom.progress = 0.5;
            zoom.start(2);
            expect(zoom.progress).toBe(0);
        });

        it('should set source from camera zoom', function ()
        {
            camera.zoom = 2.5;
            zoom.start(5);
            expect(zoom.source).toBe(2.5);
        });

        it('should return the camera', function ()
        {
            var result = zoom.start(2);
            expect(result).toBe(camera);
        });

        it('should emit ZOOM_START on the camera', function ()
        {
            zoom.start(2, 500);
            expect(camera.emit).toHaveBeenCalledWith(
                expect.stringContaining('zoomstart'),
                camera,
                zoom,
                500,
                2
            );
        });

        it('should accept an ease string', function ()
        {
            zoom.start(2, 1000, 'Linear');
            expect(typeof zoom.ease).toBe('function');
        });

        it('should accept a custom ease function', function ()
        {
            var customEase = function (v) { return v; };
            zoom.start(2, 1000, customEase);
            expect(zoom.ease).toBe(customEase);
        });

        it('should ignore an unknown ease string and not set ease as a function from it', function ()
        {
            zoom.start(2, 1000, 'NotAnEase');
            // ease should remain undefined or previous value since unknown string is not in EaseMap
            // and it's not a function, so the else-if branches are both skipped
            expect(zoom.ease).toBeUndefined();
        });

        it('should not start if already running and force is false', function ()
        {
            zoom.start(2, 500);
            camera.emit.mockClear();
            var result = zoom.start(5, 200);
            expect(result).toBe(camera);
            expect(zoom.destination).toBe(2);
            expect(camera.emit).not.toHaveBeenCalled();
        });

        it('should restart if force is true even when running', function ()
        {
            zoom.start(2, 500);
            zoom.start(5, 200, 'Linear', true);
            expect(zoom.destination).toBe(5);
            expect(zoom.duration).toBe(200);
        });

        it('should store the onUpdate callback', function ()
        {
            var cb = function () {};
            zoom.start(2, 1000, 'Linear', false, cb);
            expect(zoom._onUpdate).toBe(cb);
        });

        it('should store the context for onUpdate', function ()
        {
            var cb = function () {};
            var ctx = { name: 'myScope' };
            zoom.start(2, 1000, 'Linear', false, cb, ctx);
            expect(zoom._onUpdateScope).toBe(ctx);
        });

        it('should default callback to null', function ()
        {
            zoom.start(2);
            expect(zoom._onUpdate).toBeNull();
        });
    });

    describe('update', function ()
    {
        it('should do nothing if not running', function ()
        {
            camera.zoom = 1;
            zoom.update(0, 100);
            expect(camera.zoom).toBe(1);
        });

        it('should increment elapsed time', function ()
        {
            zoom.start(2, 1000);
            zoom.update(0, 200);
            expect(zoom._elapsed).toBe(200);
        });

        it('should update progress as a fraction of elapsed/duration', function ()
        {
            zoom.start(2, 1000);
            zoom.update(0, 500);
            expect(zoom.progress).toBeCloseTo(0.5);
        });

        it('should clamp progress to 1 when elapsed exceeds duration', function ()
        {
            zoom.start(2, 1000);
            zoom.update(0, 2000);
            expect(zoom.progress).toBe(1);
        });

        it('should interpolate camera zoom during the effect', function ()
        {
            camera.zoom = 1;
            zoom.start(3, 1000);
            zoom.update(0, 500);
            // Linear ease: source + (dest - source) * 0.5 = 1 + (3 - 1) * 0.5 = 2
            expect(camera.zoom).toBeCloseTo(2);
        });

        it('should set camera zoom to destination when complete', function ()
        {
            camera.zoom = 1;
            zoom.start(3, 1000);
            zoom.update(0, 1000);
            expect(camera.zoom).toBe(3);
        });

        it('should call effectComplete when elapsed >= duration', function ()
        {
            zoom.start(2, 1000);
            var spy = vi.spyOn(zoom, 'effectComplete');
            zoom.update(0, 1000);
            expect(spy).toHaveBeenCalled();
        });

        it('should invoke onUpdate callback during progress', function ()
        {
            var cb = vi.fn();
            zoom.start(2, 1000, 'Linear', false, cb);
            zoom.update(0, 500);
            expect(cb).toHaveBeenCalledWith(camera, expect.any(Number), expect.any(Number));
        });

        it('should invoke onUpdate callback on completion', function ()
        {
            var cb = vi.fn();
            zoom.start(2, 1000, 'Linear', false, cb);
            zoom.update(0, 1000);
            expect(cb).toHaveBeenCalled();
        });

        it('should call onUpdate with destination zoom on completion', function ()
        {
            var cb = vi.fn();
            zoom.start(3, 1000, 'Linear', false, cb);
            zoom.update(0, 1000);
            expect(cb).toHaveBeenCalledWith(camera, 1, 3);
        });

        it('should not call onUpdate when no callback is set', function ()
        {
            zoom.start(2, 1000);
            // should not throw
            expect(function () { zoom.update(0, 500); }).not.toThrow();
        });

        it('should use custom ease function to compute zoom', function ()
        {
            var quadEase = function (v) { return v * v; };
            camera.zoom = 1;
            zoom.start(5, 1000, quadEase);
            zoom.update(0, 500);
            // progress = 0.5, ease(0.5) = 0.25, zoom = 1 + (5 - 1) * 0.25 = 2
            expect(camera.zoom).toBeCloseTo(2);
        });

        it('should accumulate elapsed across multiple updates', function ()
        {
            zoom.start(2, 1000);
            zoom.update(0, 300);
            zoom.update(300, 300);
            expect(zoom._elapsed).toBe(600);
        });

        it('should stop running after completion', function ()
        {
            zoom.start(2, 1000);
            zoom.update(0, 1000);
            expect(zoom.isRunning).toBe(false);
        });
    });

    describe('effectComplete', function ()
    {
        it('should set isRunning to false', function ()
        {
            zoom.isRunning = true;
            zoom.effectComplete();
            expect(zoom.isRunning).toBe(false);
        });

        it('should clear _onUpdate', function ()
        {
            zoom._onUpdate = function () {};
            zoom.effectComplete();
            expect(zoom._onUpdate).toBeNull();
        });

        it('should clear _onUpdateScope', function ()
        {
            zoom._onUpdateScope = { name: 'scope' };
            zoom.effectComplete();
            expect(zoom._onUpdateScope).toBeNull();
        });

        it('should emit ZOOM_COMPLETE on the camera', function ()
        {
            zoom.effectComplete();
            expect(camera.emit).toHaveBeenCalledWith(
                expect.stringContaining('zoomcomplete'),
                camera,
                zoom
            );
        });
    });

    describe('reset', function ()
    {
        it('should set isRunning to false', function ()
        {
            zoom.isRunning = true;
            zoom.reset();
            expect(zoom.isRunning).toBe(false);
        });

        it('should clear _onUpdate', function ()
        {
            zoom._onUpdate = function () {};
            zoom.reset();
            expect(zoom._onUpdate).toBeNull();
        });

        it('should clear _onUpdateScope', function ()
        {
            zoom._onUpdateScope = {};
            zoom.reset();
            expect(zoom._onUpdateScope).toBeNull();
        });

        it('should not emit any events', function ()
        {
            zoom.isRunning = true;
            zoom.reset();
            expect(camera.emit).not.toHaveBeenCalled();
        });
    });

    describe('destroy', function ()
    {
        it('should set camera to null', function ()
        {
            zoom.destroy();
            expect(zoom.camera).toBeNull();
        });

        it('should set isRunning to false', function ()
        {
            zoom.isRunning = true;
            zoom.destroy();
            expect(zoom.isRunning).toBe(false);
        });

        it('should clear _onUpdate', function ()
        {
            zoom._onUpdate = function () {};
            zoom.destroy();
            expect(zoom._onUpdate).toBeNull();
        });

        it('should clear _onUpdateScope', function ()
        {
            zoom._onUpdateScope = {};
            zoom.destroy();
            expect(zoom._onUpdateScope).toBeNull();
        });
    });
});
