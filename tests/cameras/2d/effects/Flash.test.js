var Flash = require('../../../../src/cameras/2d/effects/Flash');
var Events = require('../../../../src/cameras/2d/events');

function createMockCamera ()
{
    return {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        scene: {},
        emit: vi.fn()
    };
}

function createMockCtx ()
{
    return {
        fillStyle: '',
        fillRect: vi.fn()
    };
}

describe('Flash', function ()
{
    var camera;
    var flash;

    beforeEach(function ()
    {
        camera = createMockCamera();
        flash = new Flash(camera);
    });

    describe('constructor', function ()
    {
        it('should set the camera reference', function ()
        {
            expect(flash.camera).toBe(camera);
        });

        it('should default isRunning to false', function ()
        {
            expect(flash.isRunning).toBe(false);
        });

        it('should default duration to 0', function ()
        {
            expect(flash.duration).toBe(0);
        });

        it('should default alpha to 1', function ()
        {
            expect(flash.alpha).toBe(1);
        });

        it('should default progress to 0', function ()
        {
            expect(flash.progress).toBe(0);
        });
    });

    describe('start', function ()
    {
        it('should return the camera', function ()
        {
            var result = flash.start();
            expect(result).toBe(camera);
        });

        it('should set isRunning to true', function ()
        {
            flash.start();
            expect(flash.isRunning).toBe(true);
        });

        it('should use default duration of 250', function ()
        {
            flash.start();
            expect(flash.duration).toBe(250);
        });

        it('should use a custom duration', function ()
        {
            flash.start(500);
            expect(flash.duration).toBe(500);
        });

        it('should reset progress to 0', function ()
        {
            flash.start();
            expect(flash.progress).toBe(0);
        });

        it('should use default red, green, blue of 255', function ()
        {
            flash.start();
            expect(flash.red).toBe(255);
            expect(flash.green).toBe(255);
            expect(flash.blue).toBe(255);
        });

        it('should use custom red, green, blue values', function ()
        {
            flash.start(250, 100, 150, 200);
            expect(flash.red).toBe(100);
            expect(flash.green).toBe(150);
            expect(flash.blue).toBe(200);
        });

        it('should emit FLASH_START event with correct arguments', function ()
        {
            flash.start(300, 10, 20, 30);
            expect(camera.emit).toHaveBeenCalledWith(
                Events.FLASH_START,
                camera,
                flash,
                300,
                10,
                20,
                30
            );
        });

        it('should not restart if already running and force is false', function ()
        {
            flash.start(250);
            camera.emit.mockClear();
            flash.start(500);
            expect(flash.duration).toBe(250);
            expect(camera.emit).not.toHaveBeenCalled();
        });

        it('should return camera without restarting when already running and force is false', function ()
        {
            flash.start();
            var result = flash.start(999, 0, 0, 0, false);
            expect(result).toBe(camera);
            expect(flash.duration).toBe(250);
        });

        it('should restart if already running and force is true', function ()
        {
            flash.start(250);
            flash.start(999, 10, 20, 30, true);
            expect(flash.duration).toBe(999);
            expect(flash.red).toBe(10);
        });

        it('should store the callback and context', function ()
        {
            var cb = vi.fn();
            var ctx = { foo: 'bar' };
            flash.start(250, 255, 255, 255, false, cb, ctx);
            expect(flash._onUpdate).toBe(cb);
            expect(flash._onUpdateScope).toBe(ctx);
        });

        it('should default callback to null', function ()
        {
            flash.start();
            expect(flash._onUpdate).toBeNull();
        });

        it('should reset elapsed timer to 0', function ()
        {
            flash.start();
            flash.update(0, 100);
            flash.start(250, 255, 255, 255, true);
            expect(flash._elapsed).toBe(0);
        });
    });

    describe('update', function ()
    {
        it('should do nothing if not running', function ()
        {
            flash.update(0, 100);
            expect(flash.progress).toBe(0);
        });

        it('should accumulate elapsed time', function ()
        {
            flash.start(500);
            flash.update(0, 100);
            expect(flash._elapsed).toBe(100);
            flash.update(0, 50);
            expect(flash._elapsed).toBe(150);
        });

        it('should update progress proportionally', function ()
        {
            flash.start(500);
            flash.update(0, 250);
            expect(flash.progress).toBeCloseTo(0.5);
        });

        it('should clamp progress to 1 when elapsed exceeds duration', function ()
        {
            flash.start(100);
            flash.update(0, 200);
            expect(flash.progress).toBe(1);
        });

        it('should reduce alpha over time', function ()
        {
            flash.start(1000);
            flash.update(0, 500);
            expect(flash.alpha).toBeCloseTo(0.5);
        });

        it('should call the onUpdate callback each frame', function ()
        {
            var cb = vi.fn();
            flash.start(500, 255, 255, 255, false, cb, null);
            flash.update(0, 100);
            expect(cb).toHaveBeenCalledWith(camera, flash.progress);
        });

        it('should call effectComplete when elapsed reaches duration', function ()
        {
            flash.start(100);
            flash.update(0, 100);
            expect(flash.isRunning).toBe(false);
        });

        it('should emit FLASH_COMPLETE when duration is reached', function ()
        {
            flash.start(100);
            camera.emit.mockClear();
            flash.update(0, 100);
            expect(camera.emit).toHaveBeenCalledWith(Events.FLASH_COMPLETE, camera, flash);
        });

        it('should not call onUpdate when not running', function ()
        {
            var cb = vi.fn();
            flash._onUpdate = cb;
            flash.update(0, 100);
            expect(cb).not.toHaveBeenCalled();
        });
    });

    describe('postRenderCanvas', function ()
    {
        it('should return false when not running', function ()
        {
            var ctx = createMockCtx();
            expect(flash.postRenderCanvas(ctx)).toBe(false);
        });

        it('should return true when running', function ()
        {
            var ctx = createMockCtx();
            flash.start();
            expect(flash.postRenderCanvas(ctx)).toBe(true);
        });

        it('should set fillStyle with correct rgba values', function ()
        {
            var ctx = createMockCtx();
            flash.start(250, 100, 150, 200);
            flash.postRenderCanvas(ctx);
            expect(ctx.fillStyle).toBe('rgba(100,150,200,' + flash.alpha + ')');
        });

        it('should call fillRect with camera bounds', function ()
        {
            var ctx = createMockCtx();
            camera.x = 10;
            camera.y = 20;
            camera.width = 400;
            camera.height = 300;
            flash.start();
            flash.postRenderCanvas(ctx);
            expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 400, 300);
        });

        it('should not call fillRect when not running', function ()
        {
            var ctx = createMockCtx();
            flash.postRenderCanvas(ctx);
            expect(ctx.fillRect).not.toHaveBeenCalled();
        });
    });

    describe('postRenderWebGL', function ()
    {
        it('should return false when not running', function ()
        {
            expect(flash.postRenderWebGL()).toBe(false);
        });

        it('should return true when running', function ()
        {
            flash.start();
            expect(flash.postRenderWebGL()).toBe(true);
        });

        it('should return false after effect completes', function ()
        {
            flash.start(100);
            flash.update(0, 100);
            expect(flash.postRenderWebGL()).toBe(false);
        });
    });

    describe('effectComplete', function ()
    {
        it('should set isRunning to false', function ()
        {
            flash.start();
            flash.effectComplete();
            expect(flash.isRunning).toBe(false);
        });

        it('should restore alpha to its initial value', function ()
        {
            flash.start();
            flash.update(0, 125);
            flash.effectComplete();
            expect(flash.alpha).toBeCloseTo(1);
        });

        it('should clear the onUpdate callback', function ()
        {
            var cb = vi.fn();
            flash.start(250, 255, 255, 255, false, cb);
            flash.effectComplete();
            expect(flash._onUpdate).toBeNull();
        });

        it('should clear the onUpdateScope', function ()
        {
            flash.start(250, 255, 255, 255, false, vi.fn(), { foo: 'bar' });
            flash.effectComplete();
            expect(flash._onUpdateScope).toBeNull();
        });

        it('should emit FLASH_COMPLETE on the camera', function ()
        {
            flash.start();
            camera.emit.mockClear();
            flash.effectComplete();
            expect(camera.emit).toHaveBeenCalledWith(Events.FLASH_COMPLETE, camera, flash);
        });
    });

    describe('reset', function ()
    {
        it('should set isRunning to false', function ()
        {
            flash.start();
            flash.reset();
            expect(flash.isRunning).toBe(false);
        });

        it('should clear the onUpdate callback', function ()
        {
            flash.start(250, 255, 255, 255, false, vi.fn());
            flash.reset();
            expect(flash._onUpdate).toBeNull();
        });

        it('should clear the onUpdateScope', function ()
        {
            flash.start(250, 255, 255, 255, false, vi.fn(), { foo: 'bar' });
            flash.reset();
            expect(flash._onUpdateScope).toBeNull();
        });

        it('should not emit any events', function ()
        {
            flash.start();
            camera.emit.mockClear();
            flash.reset();
            expect(camera.emit).not.toHaveBeenCalled();
        });
    });

    describe('destroy', function ()
    {
        it('should set camera to null', function ()
        {
            flash.destroy();
            expect(flash.camera).toBeNull();
        });

        it('should set isRunning to false', function ()
        {
            flash.start();
            flash.destroy();
            expect(flash.isRunning).toBe(false);
        });

        it('should clear the onUpdate callback', function ()
        {
            flash.start(250, 255, 255, 255, false, vi.fn());
            flash.destroy();
            expect(flash._onUpdate).toBeNull();
        });
    });
});
