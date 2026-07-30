var BlitterCanvasRenderer = require('../../../src/gameobjects/blitter/BlitterCanvasRenderer');

function makeCtx ()
{
    return {
        globalCompositeOperation: '',
        imageSmoothingEnabled: false,
        globalAlpha: 1,
        save: vi.fn(),
        restore: vi.fn(),
        drawImage: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn()
    };
}

function makeFrame (overrides)
{
    var defaults = {
        x: 0,
        y: 0,
        source: { image: {}, scaleMode: 0 },
        canvasData: { x: 0, y: 0, width: 32, height: 32 }
    };
    return Object.assign(defaults, overrides);
}

function makeBob (overrides)
{
    var defaults = {
        alpha: 1,
        x: 0,
        y: 0,
        flipX: false,
        flipY: false,
        frame: makeFrame()
    };
    return Object.assign(defaults, overrides);
}

function makeRenderer (ctx, blendModes)
{
    return {
        currentContext: ctx || makeCtx(),
        blendModes: blendModes || ['source-over', 'add', 'multiply']
    };
}

function makeSrc (list, overrides)
{
    var defaults = {
        alpha: 1,
        blendMode: 0,
        x: 0,
        y: 0,
        scrollFactorX: 1,
        scrollFactorY: 1,
        frame: makeFrame(),
        getRenderList: function () { return list || []; }
    };
    return Object.assign(defaults, overrides);
}

function makeCamera (overrides)
{
    var defaults = {
        alpha: 1,
        scrollX: 0,
        scrollY: 0,
        roundPixels: false,
        addToRenderList: vi.fn()
    };
    return Object.assign(defaults, overrides);
}

describe('BlitterCanvasRenderer', function ()
{
    it('should be a function', function ()
    {
        expect(typeof BlitterCanvasRenderer).toBe('function');
    });

    it('should return early and not call addToRenderList when render list is empty', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var src = makeSrc([]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
        expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should return early and not call addToRenderList when combined alpha is zero', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var src = makeSrc([makeBob()], { alpha: 0 });
        var camera = makeCamera({ alpha: 1 });

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
        expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should return early when camera alpha is zero', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var src = makeSrc([makeBob()], { alpha: 1 });
        var camera = makeCamera({ alpha: 0 });

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
    });

    it('should call camera.addToRenderList when list is non-empty and alpha > 0', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var src = makeSrc([makeBob()]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should set globalCompositeOperation from blendModes', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx, ['source-over', 'add']);
        var src = makeSrc([makeBob()], { blendMode: 1 });
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.globalCompositeOperation).toBe('add');
    });

    it('should set imageSmoothingEnabled to true when scaleMode is 0 (falsy)', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var frame = makeFrame({ source: { image: {}, scaleMode: 0 } });
        var src = makeSrc([makeBob()], { frame: frame });
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.imageSmoothingEnabled).toBe(true);
    });

    it('should set imageSmoothingEnabled to false when scaleMode is truthy', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var frame = makeFrame({ source: { image: {}, scaleMode: 1 } });
        var src = makeSrc([makeBob()], { frame: frame });
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.imageSmoothingEnabled).toBe(false);
    });

    it('should call ctx.save and ctx.restore for the outer transform', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var src = makeSrc([makeBob()]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.save).toHaveBeenCalled();
        expect(ctx.restore).toHaveBeenCalled();
    });

    it('should call parentMatrix.copyToContext when parentMatrix is provided', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var src = makeSrc([makeBob()]);
        var camera = makeCamera();
        var parentMatrix = { copyToContext: vi.fn() };

        BlitterCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(parentMatrix.copyToContext).toHaveBeenCalledWith(ctx);
    });

    it('should not call parentMatrix.copyToContext when parentMatrix is null', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var src = makeSrc([makeBob()]);
        var camera = makeCamera();
        var parentMatrix = { copyToContext: vi.fn() };

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(parentMatrix.copyToContext).not.toHaveBeenCalled();
    });

    it('should draw a bob without flip', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var bob = makeBob({ x: 10, y: 20, flipX: false, flipY: false });
        var src = makeSrc([bob]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.drawImage).toHaveBeenCalledOnce();
        expect(ctx.drawImage).toHaveBeenCalledWith(
            bob.frame.source.image,
            0, 0, 32, 32,
            10, 20, 32, 32
        );
    });

    it('should set globalAlpha to the combined bob and scene alpha', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var bob = makeBob({ alpha: 0.5 });
        var src = makeSrc([bob], { alpha: 0.8 });
        var camera = makeCamera({ alpha: 1 });

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.globalAlpha).toBeCloseTo(0.4);
    });

    it('should skip a bob whose effective alpha is zero', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var bob = makeBob({ alpha: 0 });
        var src = makeSrc([bob]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should round dx and dy when camera.roundPixels is true', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var frame = makeFrame({ x: 1.7, y: 2.4 });
        var bob = makeBob({ x: 0, y: 0, frame: frame, flipX: false, flipY: false });
        var src = makeSrc([bob]);
        var camera = makeCamera({ roundPixels: true });

        BlitterCanvasRenderer(renderer, src, camera, null);

        var call = ctx.drawImage.mock.calls[0];
        // dx + bob.x + cameraScrollX = round(1.7) + 0 + 0 = 2
        expect(call[5]).toBe(2);
        // dy + bob.y + cameraScrollY = round(2.4) + 0 + 0 = 2
        expect(call[6]).toBe(2);
    });

    it('should not draw a bob whose canvasData width is zero', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var frame = makeFrame({ canvasData: { x: 0, y: 0, width: 0, height: 32 } });
        var bob = makeBob({ frame: frame });
        var src = makeSrc([bob]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should not draw a bob whose canvasData height is zero', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var frame = makeFrame({ canvasData: { x: 0, y: 0, width: 32, height: 0 } });
        var bob = makeBob({ frame: frame });
        var src = makeSrc([bob]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should use ctx.save/translate/scale/restore for flipX bob', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var bob = makeBob({ x: 5, y: 10, flipX: true, flipY: false });
        var src = makeSrc([bob]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        // save called once for outer, once for flip
        expect(ctx.save.mock.calls.length).toBe(2);
        expect(ctx.restore.mock.calls.length).toBe(2);
        expect(ctx.translate).toHaveBeenCalledWith(5, 10);
        expect(ctx.scale).toHaveBeenCalledWith(-1, 1);
    });

    it('should use ctx.save/translate/scale/restore for flipY bob', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var bob = makeBob({ x: 5, y: 10, flipX: false, flipY: true });
        var src = makeSrc([bob]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.translate).toHaveBeenCalledWith(5, 10);
        expect(ctx.scale).toHaveBeenCalledWith(1, -1);
    });

    it('should use fx=-1 and fy=-1 for bob with both flipX and flipY', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var bob = makeBob({ x: 0, y: 0, flipX: true, flipY: true });
        var src = makeSrc([bob]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.scale).toHaveBeenCalledWith(-1, -1);
    });

    it('should account for camera scroll and src scroll factors', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var bob = makeBob({ x: 0, y: 0, flipX: false, flipY: false });
        var src = makeSrc([bob], { x: 100, y: 200, scrollFactorX: 0.5, scrollFactorY: 0.5 });
        var camera = makeCamera({ scrollX: 40, scrollY: 80 });

        BlitterCanvasRenderer(renderer, src, camera, null);

        // cameraScrollX = 100 - 40 * 0.5 = 80
        // cameraScrollY = 200 - 80 * 0.5 = 160
        // drawImage dest x = frame.x + bob.x + cameraScrollX = 0 + 0 + 80 = 80
        // drawImage dest y = frame.y + bob.y + cameraScrollY = 0 + 0 + 160 = 160
        var call = ctx.drawImage.mock.calls[0];
        expect(call[5]).toBe(80);
        expect(call[6]).toBe(160);
    });

    it('should render multiple bobs in the list', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var bobs = [makeBob({ x: 0, y: 0 }), makeBob({ x: 10, y: 20 }), makeBob({ x: 30, y: 40 })];
        var src = makeSrc(bobs);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.drawImage.mock.calls.length).toBe(3);
    });

    it('should not call drawImage for flipped bob with zero-width canvasData', function ()
    {
        var ctx = makeCtx();
        var renderer = makeRenderer(ctx);
        var frame = makeFrame({ canvasData: { x: 0, y: 0, width: 0, height: 32 } });
        var bob = makeBob({ flipX: true, frame: frame });
        var src = makeSrc([bob]);
        var camera = makeCamera();

        BlitterCanvasRenderer(renderer, src, camera, null);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });
});
