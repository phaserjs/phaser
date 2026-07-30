var Fade = require('../../../../src/cameras/2d/effects/Fade');
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

describe('Fade', function ()
{
    var camera;
    var fade;

    beforeEach(function ()
    {
        camera = createMockCamera();
        fade = new Fade(camera);
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    describe('constructor', function ()
    {
        it('should set the camera reference', function ()
        {
            expect(fade.camera).toBe(camera);
        });

        it('should default isRunning to false', function ()
        {
            expect(fade.isRunning).toBe(false);
        });

        it('should default isComplete to false', function ()
        {
            expect(fade.isComplete).toBe(false);
        });

        it('should default direction to true', function ()
        {
            expect(fade.direction).toBe(true);
        });

        it('should default duration to 0', function ()
        {
            expect(fade.duration).toBe(0);
        });

        it('should default progress to 0', function ()
        {
            expect(fade.progress).toBe(0);
        });
    });

    describe('start', function ()
    {
        it('should set isRunning to true', function ()
        {
            fade.start();
            expect(fade.isRunning).toBe(true);
        });

        it('should set isComplete to false', function ()
        {
            fade.isComplete = true;
            fade.start();
            expect(fade.isComplete).toBe(false);
        });

        it('should use default duration of 1000', function ()
        {
            fade.start();
            expect(fade.duration).toBe(1000);
        });

        it('should use provided duration', function ()
        {
            fade.start(true, 2000);
            expect(fade.duration).toBe(2000);
        });

        it('should default direction to true (fade out)', function ()
        {
            fade.start();
            expect(fade.direction).toBe(true);
        });

        it('should set direction to false (fade in)', function ()
        {
            fade.start(false);
            expect(fade.direction).toBe(false);
        });

        it('should default red, green, blue to 0', function ()
        {
            fade.start();
            expect(fade.red).toBe(0);
            expect(fade.green).toBe(0);
            expect(fade.blue).toBe(0);
        });

        it('should set provided color values', function ()
        {
            fade.start(true, 1000, 255, 128, 64);
            expect(fade.red).toBe(255);
            expect(fade.green).toBe(128);
            expect(fade.blue).toBe(64);
        });

        it('should reset progress to 0', function ()
        {
            fade.progress = 0.5;
            fade.start();
            expect(fade.progress).toBe(0);
        });

        it('should set alpha to MIN_VALUE when fading out', function ()
        {
            fade.start(true);
            expect(fade.alpha).toBe(Number.MIN_VALUE);
        });

        it('should set alpha to 1 when fading in', function ()
        {
            fade.start(false);
            expect(fade.alpha).toBe(1);
        });

        it('should return the camera', function ()
        {
            var result = fade.start();
            expect(result).toBe(camera);
        });

        it('should emit FADE_OUT_START when direction is true', function ()
        {
            fade.start(true, 1000, 255, 0, 0);
            expect(camera.emit).toHaveBeenCalledWith(
                Events.FADE_OUT_START, camera, fade, 1000, 255, 0, 0
            );
        });

        it('should emit FADE_IN_START when direction is false', function ()
        {
            fade.start(false, 500, 0, 255, 0);
            expect(camera.emit).toHaveBeenCalledWith(
                Events.FADE_IN_START, camera, fade, 500, 0, 255, 0
            );
        });

        it('should store the callback and context', function ()
        {
            var cb = vi.fn();
            var ctx = { foo: 'bar' };
            fade.start(true, 1000, 0, 0, 0, false, cb, ctx);
            expect(fade._onUpdate).toBe(cb);
            expect(fade._onUpdateScope).toBe(ctx);
        });

        it('should not start if already running and force is false', function ()
        {
            fade.start(true, 1000);
            camera.emit.mockClear();
            fade.start(true, 500);
            expect(fade.duration).toBe(1000);
            expect(camera.emit).not.toHaveBeenCalled();
        });

        it('should restart if already running and force is true', function ()
        {
            fade.start(true, 1000);
            camera.emit.mockClear();
            fade.start(true, 500, 0, 0, 0, true);
            expect(fade.duration).toBe(500);
            expect(camera.emit).toHaveBeenCalled();
        });

        it('should return camera without starting if running and force is false', function ()
        {
            fade.start(true, 1000);
            var result = fade.start(true, 500);
            expect(result).toBe(camera);
            expect(fade.duration).toBe(1000);
        });

        it('should default context to camera.scene', function ()
        {
            fade.start();
            expect(fade._onUpdateScope).toBe(camera.scene);
        });
    });

    describe('update', function ()
    {
        it('should do nothing if not running', function ()
        {
            fade.update(0, 100);
            expect(fade.progress).toBe(0);
        });

        it('should increment elapsed time', function ()
        {
            fade.start(true, 1000);
            fade.update(0, 200);
            expect(fade._elapsed).toBe(200);
        });

        it('should update progress based on elapsed / duration', function ()
        {
            fade.start(true, 1000);
            fade.update(0, 500);
            expect(fade.progress).toBeCloseTo(0.5);
        });

        it('should clamp progress to 1 when elapsed exceeds duration', function ()
        {
            fade.start(true, 1000);
            fade.update(0, 2000);
            expect(fade.progress).toBe(1);
        });

        it('should set alpha to progress when fading out and not yet complete', function ()
        {
            fade.start(true, 1000);
            fade.update(0, 500);
            expect(fade.alpha).toBeCloseTo(0.5);
        });

        it('should set alpha to 1 - progress when fading in and not yet complete', function ()
        {
            fade.start(false, 1000);
            fade.update(0, 250);
            expect(fade.alpha).toBeCloseTo(0.75);
        });

        it('should call the onUpdate callback with camera and progress', function ()
        {
            var cb = vi.fn();
            fade.start(true, 1000, 0, 0, 0, false, cb, null);
            fade.update(0, 300);
            expect(cb).toHaveBeenCalledWith(camera, fade.progress);
        });

        it('should call onUpdate with correct scope', function ()
        {
            var scope = { called: false };
            var cb = function ()
            {
                scope.called = (this === scope);
            };
            fade.start(true, 1000, 0, 0, 0, false, cb, scope);
            fade.update(0, 300);
            expect(scope.called).toBe(true);
        });

        it('should call effectComplete when elapsed >= duration', function ()
        {
            fade.start(true, 1000);
            var completeSpy = vi.spyOn(fade, 'effectComplete');
            fade.update(0, 1000);
            expect(completeSpy).toHaveBeenCalled();
        });

        it('should set alpha to 1 on completion when fading out', function ()
        {
            fade.start(true, 1000);
            fade.update(0, 1000);
            expect(fade.alpha).toBe(1);
        });

        it('should set alpha to 0 on completion when fading in', function ()
        {
            fade.start(false, 1000);
            fade.update(0, 1000);
            expect(fade.alpha).toBe(0);
        });

        it('should accumulate delta across multiple updates', function ()
        {
            fade.start(true, 1000);
            fade.update(0, 200);
            fade.update(200, 300);
            expect(fade._elapsed).toBe(500);
            expect(fade.progress).toBeCloseTo(0.5);
        });
    });

    describe('postRenderCanvas', function ()
    {
        var ctx;

        beforeEach(function ()
        {
            ctx = {
                fillStyle: '',
                fillRect: vi.fn()
            };
        });

        it('should return false if not running and not complete', function ()
        {
            expect(fade.postRenderCanvas(ctx)).toBe(false);
        });

        it('should return true if running', function ()
        {
            fade.start(true, 1000);
            expect(fade.postRenderCanvas(ctx)).toBe(true);
        });

        it('should return true if complete', function ()
        {
            fade.isComplete = true;
            expect(fade.postRenderCanvas(ctx)).toBe(true);
        });

        it('should set fillStyle with correct rgba values', function ()
        {
            fade.start(true, 1000, 255, 128, 64);
            fade.alpha = 0.5;
            fade.postRenderCanvas(ctx);
            expect(ctx.fillStyle).toBe('rgba(255,128,64,0.5)');
        });

        it('should call fillRect with camera dimensions', function ()
        {
            camera.x = 10;
            camera.y = 20;
            camera.width = 400;
            camera.height = 300;
            fade.start();
            fade.postRenderCanvas(ctx);
            expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 400, 300);
        });

        it('should not call fillRect if not running and not complete', function ()
        {
            fade.postRenderCanvas(ctx);
            expect(ctx.fillRect).not.toHaveBeenCalled();
        });
    });

    describe('postRenderWebGL', function ()
    {
        it('should return false if not running and not complete', function ()
        {
            expect(fade.postRenderWebGL()).toBe(false);
        });

        it('should return true if running', function ()
        {
            fade.isRunning = true;
            expect(fade.postRenderWebGL()).toBe(true);
        });

        it('should return true if complete', function ()
        {
            fade.isComplete = true;
            expect(fade.postRenderWebGL()).toBe(true);
        });

        it('should return true if both running and complete', function ()
        {
            fade.isRunning = true;
            fade.isComplete = true;
            expect(fade.postRenderWebGL()).toBe(true);
        });
    });

    describe('effectComplete', function ()
    {
        it('should set isRunning to false', function ()
        {
            fade.isRunning = true;
            fade.effectComplete();
            expect(fade.isRunning).toBe(false);
        });

        it('should set isComplete to true', function ()
        {
            fade.effectComplete();
            expect(fade.isComplete).toBe(true);
        });

        it('should clear the onUpdate callback', function ()
        {
            fade._onUpdate = vi.fn();
            fade.effectComplete();
            expect(fade._onUpdate).toBeNull();
        });

        it('should clear the onUpdateScope', function ()
        {
            fade._onUpdateScope = {};
            fade.effectComplete();
            expect(fade._onUpdateScope).toBeNull();
        });

        it('should emit FADE_OUT_COMPLETE when direction is true', function ()
        {
            fade.direction = true;
            fade.effectComplete();
            expect(camera.emit).toHaveBeenCalledWith(Events.FADE_OUT_COMPLETE, camera, fade);
        });

        it('should emit FADE_IN_COMPLETE when direction is false', function ()
        {
            fade.direction = false;
            fade.effectComplete();
            expect(camera.emit).toHaveBeenCalledWith(Events.FADE_IN_COMPLETE, camera, fade);
        });
    });

    describe('reset', function ()
    {
        it('should set isRunning to false', function ()
        {
            fade.isRunning = true;
            fade.reset();
            expect(fade.isRunning).toBe(false);
        });

        it('should set isComplete to false', function ()
        {
            fade.isComplete = true;
            fade.reset();
            expect(fade.isComplete).toBe(false);
        });

        it('should clear the onUpdate callback', function ()
        {
            fade._onUpdate = vi.fn();
            fade.reset();
            expect(fade._onUpdate).toBeNull();
        });

        it('should clear the onUpdateScope', function ()
        {
            fade._onUpdateScope = {};
            fade.reset();
            expect(fade._onUpdateScope).toBeNull();
        });

        it('should not emit any events', function ()
        {
            fade.isRunning = true;
            fade.reset();
            expect(camera.emit).not.toHaveBeenCalled();
        });
    });

    describe('destroy', function ()
    {
        it('should set camera to null', function ()
        {
            fade.destroy();
            expect(fade.camera).toBeNull();
        });

        it('should set isRunning to false', function ()
        {
            fade.isRunning = true;
            fade.destroy();
            expect(fade.isRunning).toBe(false);
        });

        it('should set isComplete to false', function ()
        {
            fade.isComplete = true;
            fade.destroy();
            expect(fade.isComplete).toBe(false);
        });

        it('should clear the onUpdate callback', function ()
        {
            fade._onUpdate = vi.fn();
            fade.destroy();
            expect(fade._onUpdate).toBeNull();
        });
    });
});
