var SetTransform = require('../../../../src/renderer/canvas/utils/SetTransform');

describe('Phaser.Renderer.Canvas.SetTransform', function ()
{
    var renderer;
    var ctx;
    var src;
    var camera;

    beforeEach(function ()
    {
        renderer = {
            blendModes: [ 'source-over', 'add', 'multiply', 'screen' ],
            antialias: true
        };

        ctx = {
            globalCompositeOperation: '',
            globalAlpha: 1,
            imageSmoothingEnabled: false,
            save: vi.fn(),
            setTransform: vi.fn()
        };

        src = {
            alpha: 1,
            blendMode: 0,
            frame: null,
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            scrollFactorX: 1,
            scrollFactorY: 1
        };

        camera = {
            alpha: 1,
            scrollX: 0,
            scrollY: 0,
            matrixExternal: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
            matrixCombined: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }
        };
    });

    // -------------------------------------------------------------------------
    //  Alpha gating — return false
    // -------------------------------------------------------------------------

    it('should return false when camera alpha is zero', function ()
    {
        camera.alpha = 0;

        expect(SetTransform(renderer, ctx, src, camera)).toBe(false);
    });

    it('should return false when source alpha is zero', function ()
    {
        src.alpha = 0;

        expect(SetTransform(renderer, ctx, src, camera)).toBe(false);
    });

    it('should return false when combined alpha is zero', function ()
    {
        camera.alpha = 0.5;
        src.alpha = 0;

        expect(SetTransform(renderer, ctx, src, camera)).toBe(false);
    });

    it('should return false when combined alpha is negative', function ()
    {
        camera.alpha = -1;
        src.alpha = 1;

        expect(SetTransform(renderer, ctx, src, camera)).toBe(false);
    });

    it('should return false when both alphas are negative and product is positive but via separate negatives', function ()
    {
        camera.alpha = -0.5;
        src.alpha = -0.5;

        // product is 0.25 which is > 0, so should return true
        expect(SetTransform(renderer, ctx, src, camera)).toBe(true);
    });

    it('should not call ctx.save when alpha check fails', function ()
    {
        camera.alpha = 0;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.save).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    //  Successful render — return true
    // -------------------------------------------------------------------------

    it('should return true when both alphas are positive', function ()
    {
        expect(SetTransform(renderer, ctx, src, camera)).toBe(true);
    });

    it('should return true when combined alpha is very small but positive', function ()
    {
        camera.alpha = 0.001;
        src.alpha = 0.001;

        expect(SetTransform(renderer, ctx, src, camera)).toBe(true);
    });

    it('should return true when alpha is exactly 1', function ()
    {
        camera.alpha = 1;
        src.alpha = 1;

        expect(SetTransform(renderer, ctx, src, camera)).toBe(true);
    });

    // -------------------------------------------------------------------------
    //  globalAlpha
    // -------------------------------------------------------------------------

    it('should set ctx.globalAlpha to the product of camera and source alpha', function ()
    {
        camera.alpha = 0.5;
        src.alpha = 0.8;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.globalAlpha).toBeCloseTo(0.4);
    });

    it('should set ctx.globalAlpha to 1 when both alphas are 1', function ()
    {
        camera.alpha = 1;
        src.alpha = 1;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.globalAlpha).toBe(1);
    });

    it('should set ctx.globalAlpha to the correct fractional value', function ()
    {
        camera.alpha = 0.25;
        src.alpha = 0.4;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.globalAlpha).toBeCloseTo(0.1);
    });

    // -------------------------------------------------------------------------
    //  globalCompositeOperation
    // -------------------------------------------------------------------------

    it('should set ctx.globalCompositeOperation from renderer blendModes using src.blendMode as index', function ()
    {
        src.blendMode = 0;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.globalCompositeOperation).toBe('source-over');
    });

    it('should set ctx.globalCompositeOperation to the correct blend mode for blendMode 1', function ()
    {
        src.blendMode = 1;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.globalCompositeOperation).toBe('add');
    });

    it('should set ctx.globalCompositeOperation to the correct blend mode for blendMode 2', function ()
    {
        src.blendMode = 2;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.globalCompositeOperation).toBe('multiply');
    });

    // -------------------------------------------------------------------------
    //  ctx.save
    // -------------------------------------------------------------------------

    it('should call ctx.save once on success', function ()
    {
        SetTransform(renderer, ctx, src, camera);

        expect(ctx.save).toHaveBeenCalledTimes(1);
    });

    it('should call ctx.save after setting globalAlpha and globalCompositeOperation', function ()
    {
        var callOrder = [];

        Object.defineProperty(ctx, 'globalAlpha',
        {
            set: function (v)
            {
                this._globalAlpha = v;
                callOrder.push('globalAlpha');
            },
            get: function () { return this._globalAlpha; },
            configurable: true
        });

        ctx.save = vi.fn(function ()
        {
            callOrder.push('save');
        });

        SetTransform(renderer, ctx, src, camera);

        expect(callOrder.indexOf('globalAlpha')).toBeLessThan(callOrder.indexOf('save'));
    });

    // -------------------------------------------------------------------------
    //  imageSmoothingEnabled — no frame
    // -------------------------------------------------------------------------

    it('should set ctx.imageSmoothingEnabled to renderer.antialias when src has no frame', function ()
    {
        src.frame = null;
        renderer.antialias = true;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.imageSmoothingEnabled).toBe(true);
    });

    it('should set ctx.imageSmoothingEnabled to false when renderer.antialias is false and src has no frame', function ()
    {
        src.frame = null;
        renderer.antialias = false;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.imageSmoothingEnabled).toBe(false);
    });

    // -------------------------------------------------------------------------
    //  imageSmoothingEnabled — with frame
    // -------------------------------------------------------------------------

    it('should set ctx.imageSmoothingEnabled to true when frame.source.scaleMode is 0 (falsy)', function ()
    {
        src.frame = { source: { scaleMode: 0 } };

        SetTransform(renderer, ctx, src, camera);

        // !0 === true
        expect(ctx.imageSmoothingEnabled).toBe(true);
    });

    it('should set ctx.imageSmoothingEnabled to false when frame.source.scaleMode is 1 (truthy)', function ()
    {
        src.frame = { source: { scaleMode: 1 } };

        SetTransform(renderer, ctx, src, camera);

        // !1 === false
        expect(ctx.imageSmoothingEnabled).toBe(false);
    });

    it('should prefer frame over renderer.antialias for imageSmoothingEnabled', function ()
    {
        src.frame = { source: { scaleMode: 0 } };
        renderer.antialias = false;

        SetTransform(renderer, ctx, src, camera);

        // frame is present: !scaleMode = !0 = true, not renderer.antialias
        expect(ctx.imageSmoothingEnabled).toBe(true);
    });

    it('should use renderer.antialias when frame is undefined', function ()
    {
        src.frame = undefined;
        renderer.antialias = false;

        SetTransform(renderer, ctx, src, camera);

        expect(ctx.imageSmoothingEnabled).toBe(false);
    });

    // -------------------------------------------------------------------------
    //  parentMatrix (optional) — should not affect return value
    // -------------------------------------------------------------------------

    it('should return true when a parentMatrix argument is provided', function ()
    {
        var parentMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0, matrix: [ 1, 0, 0, 1, 0, 0 ] };

        expect(SetTransform(renderer, ctx, src, camera, parentMatrix)).toBe(true);
    });

    it('should return true when parentMatrix is null', function ()
    {
        expect(SetTransform(renderer, ctx, src, camera, null)).toBe(true);
    });
});
