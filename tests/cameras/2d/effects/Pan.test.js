var Pan = require('../../../../src/cameras/2d/effects/Pan');

function createMockCamera ()
{
    var cam = {
        scrollX: 0,
        scrollY: 0,
        scene: {},
        _emitted: [],
        emit: function (event)
        {
            this._emitted.push(Array.prototype.slice.call(arguments));
        },
        getScroll: function (x, y, out)
        {
            out.x = x;
            out.y = y;
        },
        setScroll: function (x, y)
        {
            this.scrollX = x;
            this.scrollY = y;
        },
        centerOn: function (x, y)
        {
            this.scrollX = x;
            this.scrollY = y;
        }
    };
    return cam;
}

describe('Pan', function ()
{
    var cam;
    var pan;

    beforeEach(function ()
    {
        cam = createMockCamera();
        pan = new Pan(cam);
    });

    describe('Constructor', function ()
    {
        it('should set the camera reference', function ()
        {
            expect(pan.camera).toBe(cam);
        });

        it('should default isRunning to false', function ()
        {
            expect(pan.isRunning).toBe(false);
        });

        it('should default duration to 0', function ()
        {
            expect(pan.duration).toBe(0);
        });

        it('should default progress to 0', function ()
        {
            expect(pan.progress).toBe(0);
        });

        it('should create source as a Vector2-like object', function ()
        {
            expect(pan.source).toBeDefined();
            expect(pan.source.x).toBe(0);
            expect(pan.source.y).toBe(0);
        });

        it('should create current as a Vector2-like object', function ()
        {
            expect(pan.current).toBeDefined();
            expect(pan.current.x).toBe(0);
            expect(pan.current.y).toBe(0);
        });

        it('should create destination as a Vector2-like object', function ()
        {
            expect(pan.destination).toBeDefined();
            expect(pan.destination.x).toBe(0);
            expect(pan.destination.y).toBe(0);
        });
    });

    describe('start', function ()
    {
        it('should return the camera', function ()
        {
            var result = pan.start(100, 200);
            expect(result).toBe(cam);
        });

        it('should set isRunning to true', function ()
        {
            pan.start(100, 200);
            expect(pan.isRunning).toBe(true);
        });

        it('should set the default duration to 1000', function ()
        {
            pan.start(100, 200);
            expect(pan.duration).toBe(1000);
        });

        it('should set a custom duration', function ()
        {
            pan.start(100, 200, 500);
            expect(pan.duration).toBe(500);
        });

        it('should reset progress to 0', function ()
        {
            pan.progress = 0.5;
            pan.start(100, 200);
            expect(pan.progress).toBe(0);
        });

        it('should set destination coordinates', function ()
        {
            pan.start(300, 400);
            expect(pan.destination.x).toBe(300);
            expect(pan.destination.y).toBe(400);
        });

        it('should record the camera scroll as source', function ()
        {
            cam.scrollX = 50;
            cam.scrollY = 75;
            pan.start(300, 400);
            expect(pan.source.x).toBe(50);
            expect(pan.source.y).toBe(75);
        });

        it('should set ease function from string', function ()
        {
            pan.start(100, 200, 1000, 'Linear');
            expect(typeof pan.ease).toBe('function');
        });

        it('should set ease function from function', function ()
        {
            var customEase = function (v) { return v; };
            pan.start(100, 200, 1000, customEase);
            expect(pan.ease).toBe(customEase);
        });

        it('should not restart if already running and force is false', function ()
        {
            pan.start(100, 200, 1000);
            pan.start(300, 400, 500);
            expect(pan.destination.x).toBe(100);
            expect(pan.destination.y).toBe(200);
        });

        it('should restart if already running and force is true', function ()
        {
            pan.start(100, 200, 1000);
            pan.start(300, 400, 500, 'Linear', true);
            expect(pan.destination.x).toBe(300);
            expect(pan.destination.y).toBe(400);
        });

        it('should emit PAN_START event', function ()
        {
            pan.start(100, 200, 1000);
            expect(cam._emitted.length).toBeGreaterThan(0);
            expect(cam._emitted[0][0]).toContain('camerapanstart');
        });

        it('should store the onUpdate callback', function ()
        {
            var cb = function () {};
            pan.start(100, 200, 1000, 'Linear', false, cb);
            expect(pan._onUpdate).toBe(cb);
        });

        it('should store the onUpdate context', function ()
        {
            var ctx = { foo: 'bar' };
            var cb = function () {};
            pan.start(100, 200, 1000, 'Linear', false, cb, ctx);
            expect(pan._onUpdateScope).toBe(ctx);
        });

        it('should default onUpdate callback to null when not provided', function ()
        {
            pan.start(100, 200);
            expect(pan._onUpdate).toBeNull();
        });

        it('should reset _elapsed to 0', function ()
        {
            pan._elapsed = 999;
            pan.start(100, 200);
            expect(pan._elapsed).toBe(0);
        });
    });

    describe('update', function ()
    {
        it('should do nothing if not running', function ()
        {
            pan.isRunning = false;
            pan.update(0, 16);
            expect(pan.progress).toBe(0);
        });

        it('should accumulate elapsed time', function ()
        {
            pan.start(100, 200, 1000);
            pan.update(0, 100);
            expect(pan._elapsed).toBe(100);
        });

        it('should update progress as a fraction of elapsed/duration', function ()
        {
            pan.start(100, 200, 1000);
            pan.update(0, 500);
            expect(pan.progress).toBeCloseTo(0.5);
        });

        it('should clamp progress to 1 when elapsed exceeds duration', function ()
        {
            pan.start(100, 200, 1000);
            pan.update(0, 2000);
            expect(pan.progress).toBe(1);
        });

        it('should scroll the camera toward the destination during pan', function ()
        {
            cam.scrollX = 0;
            cam.scrollY = 0;
            pan.start(200, 0, 1000);
            pan.update(0, 500);
            expect(cam.scrollX).toBeGreaterThan(0);
            expect(cam.scrollX).toBeLessThan(200);
        });

        it('should call centerOn when elapsed reaches duration', function ()
        {
            var centerOnCalled = false;
            var centerX, centerY;
            cam.centerOn = function (x, y)
            {
                centerOnCalled = true;
                centerX = x;
                centerY = y;
                cam.scrollX = x;
                cam.scrollY = y;
            };
            pan.start(300, 400, 1000);
            pan.update(0, 1000);
            expect(centerOnCalled).toBe(true);
            expect(centerX).toBe(300);
            expect(centerY).toBe(400);
        });

        it('should call effectComplete when elapsed reaches duration', function ()
        {
            pan.start(100, 200, 1000);
            pan.update(0, 1000);
            expect(pan.isRunning).toBe(false);
        });

        it('should invoke the onUpdate callback during pan', function ()
        {
            var called = false;
            var cb = function () { called = true; };
            pan.start(100, 200, 1000, 'Linear', false, cb);
            pan.update(0, 500);
            expect(called).toBe(true);
        });

        it('should invoke the onUpdate callback with correct arguments during pan', function ()
        {
            var cbArgs;
            var cb = function () { cbArgs = Array.prototype.slice.call(arguments); };
            pan.start(100, 200, 1000, 'Linear', false, cb);
            pan.update(0, 500);
            expect(cbArgs[0]).toBe(cam);
            expect(cbArgs[1]).toBeCloseTo(0.5);
        });

        it('should invoke the onUpdate callback on completion', function ()
        {
            var callCount = 0;
            var cb = function () { callCount++; };
            pan.start(100, 200, 1000, 'Linear', false, cb);
            pan.update(0, 1000);
            expect(callCount).toBe(1);
        });

        it('should invoke the onUpdate callback with context', function ()
        {
            var receivedContext;
            var ctx = { tag: 'testContext' };
            var cb = function () { receivedContext = this; };
            pan.start(100, 200, 1000, 'Linear', false, cb, ctx);
            pan.update(0, 500);
            expect(receivedContext).toBe(ctx);
        });
    });

    describe('effectComplete', function ()
    {
        it('should set isRunning to false', function ()
        {
            pan.isRunning = true;
            pan.effectComplete();
            expect(pan.isRunning).toBe(false);
        });

        it('should clear the _onUpdate callback', function ()
        {
            pan._onUpdate = function () {};
            pan.effectComplete();
            expect(pan._onUpdate).toBeNull();
        });

        it('should clear the _onUpdateScope', function ()
        {
            pan._onUpdateScope = { foo: 'bar' };
            pan.effectComplete();
            expect(pan._onUpdateScope).toBeNull();
        });

        it('should emit PAN_COMPLETE event', function ()
        {
            pan.effectComplete();
            var lastEmit = cam._emitted[cam._emitted.length - 1];
            expect(lastEmit[0]).toContain('camerapancomplete');
        });

        it('should pass camera and effect to PAN_COMPLETE event', function ()
        {
            pan.effectComplete();
            var lastEmit = cam._emitted[cam._emitted.length - 1];
            expect(lastEmit[1]).toBe(cam);
            expect(lastEmit[2]).toBe(pan);
        });
    });

    describe('reset', function ()
    {
        it('should set isRunning to false', function ()
        {
            pan.isRunning = true;
            pan.reset();
            expect(pan.isRunning).toBe(false);
        });

        it('should clear the _onUpdate callback', function ()
        {
            pan._onUpdate = function () {};
            pan.reset();
            expect(pan._onUpdate).toBeNull();
        });

        it('should clear the _onUpdateScope', function ()
        {
            pan._onUpdateScope = { foo: 'bar' };
            pan.reset();
            expect(pan._onUpdateScope).toBeNull();
        });

        it('should not emit any events', function ()
        {
            pan.reset();
            expect(cam._emitted.length).toBe(0);
        });
    });

    describe('destroy', function ()
    {
        it('should set camera to null', function ()
        {
            pan.destroy();
            expect(pan.camera).toBeNull();
        });

        it('should set source to null', function ()
        {
            pan.destroy();
            expect(pan.source).toBeNull();
        });

        it('should set destination to null', function ()
        {
            pan.destroy();
            expect(pan.destination).toBeNull();
        });

        it('should set isRunning to false', function ()
        {
            pan.isRunning = true;
            pan.destroy();
            expect(pan.isRunning).toBe(false);
        });

        it('should clear callbacks', function ()
        {
            pan._onUpdate = function () {};
            pan._onUpdateScope = {};
            pan.destroy();
            expect(pan._onUpdate).toBeNull();
            expect(pan._onUpdateScope).toBeNull();
        });
    });
});
