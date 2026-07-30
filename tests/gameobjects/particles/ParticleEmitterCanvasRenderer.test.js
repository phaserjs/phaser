var ParticleEmitterCanvasRenderer = require('../../../src/gameobjects/particles/ParticleEmitterCanvasRenderer');

describe('ParticleEmitterCanvasRenderer', function ()
{
    var renderer;
    var emitter;
    var camera;
    var ctx;

    function makeCtx ()
    {
        return {
            save: vi.fn(),
            restore: vi.fn(),
            drawImage: vi.fn(),
            setTransform: vi.fn(),
            globalAlpha: 1,
            globalCompositeOperation: '',
            imageSmoothingEnabled: true
        };
    }

    function makeCameraMatrix ()
    {
        return {
            a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
            tx: 0, ty: 0
        };
    }

    function makeParticle (overrides)
    {
        var p = {
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            x: 0,
            y: 0,
            rotation: 0,
            frame: {
                halfWidth: 16,
                halfHeight: 16,
                canvasData: { x: 0, y: 0, width: 32, height: 32 },
                source: { image: {}, scaleMode: 0 }
            }
        };

        if (overrides)
        {
            for (var key in overrides)
            {
                p[key] = overrides[key];
            }
        }

        return p;
    }

    function makeEmitter (particles, overrides)
    {
        var e = {
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            scrollFactorX: 1,
            scrollFactorY: 1,
            blendMode: 0,
            visible: true,
            alive: particles || [],
            viewBounds: null,
            sortCallback: null,
            depthSort: vi.fn()
        };

        if (overrides)
        {
            for (var key in overrides)
            {
                e[key] = overrides[key];
            }
        }

        return e;
    }

    function makeCamera (overrides)
    {
        var c = {
            alpha: 1,
            scrollX: 0,
            scrollY: 0,
            roundPixels: false,
            worldView: { x: -512, y: -384, width: 1024, height: 768, right: 512, bottom: 384 },
            matrix: makeCameraMatrix(),
            addToRenderList: vi.fn()
        };

        if (overrides)
        {
            for (var key in overrides)
            {
                c[key] = overrides[key];
            }
        }

        return c;
    }

    beforeEach(function ()
    {
        ctx = makeCtx();
        renderer = {
            currentContext: ctx,
            blendModes: ['source-over', 'add', 'multiply']
        };
        camera = makeCamera();
        emitter = makeEmitter([]);
    });

    it('should be a function', function ()
    {
        expect(typeof ParticleEmitterCanvasRenderer).toBe('function');
    });

    it('should call camera.addToRenderList with the emitter', function ()
    {
        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(camera.addToRenderList).toHaveBeenCalledWith(emitter);
    });

    it('should call addToRenderList even when emitter is not visible', function ()
    {
        emitter.visible = false;

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(camera.addToRenderList).toHaveBeenCalledWith(emitter);
    });

    it('should return early and not call ctx.save when emitter is not visible', function ()
    {
        emitter.visible = false;
        emitter.alive = [makeParticle()];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should return early when particleCount is zero', function ()
    {
        emitter.visible = true;
        emitter.alive = [];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should return early when viewBounds does not intersect camera worldView', function ()
    {
        emitter.alive = [makeParticle()];
        emitter.viewBounds = { x: 9999, y: 9999, width: 10, height: 10, right: 10009, bottom: 10009 };

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should proceed when viewBounds intersects camera worldView', function ()
    {
        emitter.alive = [makeParticle()];
        emitter.viewBounds = { x: -100, y: -100, width: 200, height: 200, right: 100, bottom: 100 };

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.save).toHaveBeenCalled();
    });

    it('should call ctx.save and ctx.restore for each visible particle frame with positive dimensions', function ()
    {
        emitter.alive = [makeParticle(), makeParticle()];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        // outer save/restore pair + one per particle with valid frame
        expect(ctx.save.mock.calls.length).toBe(3);
        expect(ctx.restore.mock.calls.length).toBe(3);
    });

    it('should set globalCompositeOperation from blendModes using emitter blendMode', function ()
    {
        emitter.blendMode = 1;
        emitter.alive = [makeParticle()];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.globalCompositeOperation).toBe('add');
    });

    it('should skip particle with alpha <= 0', function ()
    {
        emitter.alive = [makeParticle({ alpha: 0 })];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        // only outer save/restore, no per-particle save/restore
        expect(ctx.save.mock.calls.length).toBe(1);
        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should skip particle with negative alpha', function ()
    {
        emitter.alive = [makeParticle({ alpha: -0.5 })];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should skip particle when emitter alpha makes combined alpha <= 0', function ()
    {
        emitter.alpha = 0;
        emitter.alive = [makeParticle({ alpha: 1 })];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should skip particle when camera alpha makes combined alpha <= 0', function ()
    {
        camera.alpha = 0;
        emitter.alive = [makeParticle({ alpha: 1 })];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should skip particle with scaleX of zero', function ()
    {
        emitter.alive = [makeParticle({ scaleX: 0 })];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should skip particle with scaleY of zero', function ()
    {
        emitter.alive = [makeParticle({ scaleY: 0 })];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should skip particle when canvasData width is zero', function ()
    {
        var particle = makeParticle();
        particle.frame.canvasData.width = 0;
        emitter.alive = [particle];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should skip particle when canvasData height is zero', function ()
    {
        var particle = makeParticle();
        particle.frame.canvasData.height = 0;
        emitter.alive = [particle];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).not.toHaveBeenCalled();
    });

    it('should call ctx.drawImage for a valid particle', function ()
    {
        emitter.alive = [makeParticle()];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).toHaveBeenCalledTimes(1);
    });

    it('should call ctx.drawImage for each valid particle', function ()
    {
        emitter.alive = [makeParticle(), makeParticle(), makeParticle()];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).toHaveBeenCalledTimes(3);
    });

    it('should set ctx.globalAlpha to the combined alpha value', function ()
    {
        emitter.alpha = 0.5;
        camera.alpha = 0.8;
        emitter.alive = [makeParticle({ alpha: 1 })];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.globalAlpha).toBeCloseTo(0.4);
    });

    it('should set imageSmoothingEnabled to false when scaleMode is truthy', function ()
    {
        var particle = makeParticle();
        particle.frame.source.scaleMode = 1;
        emitter.alive = [particle];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.imageSmoothingEnabled).toBe(false);
    });

    it('should set imageSmoothingEnabled to true when scaleMode is falsy', function ()
    {
        var particle = makeParticle();
        particle.frame.source.scaleMode = 0;
        emitter.alive = [particle];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.imageSmoothingEnabled).toBe(true);
    });

    it('should call emitter.depthSort when sortCallback is set', function ()
    {
        emitter.sortCallback = function () {};
        emitter.alive = [makeParticle()];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(emitter.depthSort).toHaveBeenCalledTimes(1);
    });

    it('should not call emitter.depthSort when sortCallback is null', function ()
    {
        emitter.sortCallback = null;
        emitter.alive = [makeParticle()];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(emitter.depthSort).not.toHaveBeenCalled();
    });

    it('should process a mix of skipped and valid particles', function ()
    {
        emitter.alive = [
            makeParticle({ alpha: 0 }),
            makeParticle(),
            makeParticle({ scaleX: 0 }),
            makeParticle()
        ];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        expect(ctx.drawImage).toHaveBeenCalledTimes(2);
    });

    it('should not throw when called without parentMatrix', function ()
    {
        emitter.alive = [makeParticle()];

        expect(function ()
        {
            ParticleEmitterCanvasRenderer(renderer, emitter, camera);
        }).not.toThrow();
    });

    it('should not throw when called with a parentMatrix', function ()
    {
        var TransformMatrix = require('../../../src/gameobjects/components/TransformMatrix');
        var parentMatrix = new TransformMatrix();
        emitter.alive = [makeParticle()];

        expect(function ()
        {
            ParticleEmitterCanvasRenderer(renderer, emitter, camera, parentMatrix);
        }).not.toThrow();
    });

    it('should pass correct arguments to ctx.drawImage', function ()
    {
        var particle = makeParticle();
        var cd = particle.frame.canvasData;
        var img = particle.frame.source.image;
        emitter.alive = [particle];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        var call = ctx.drawImage.mock.calls[0];
        expect(call[0]).toBe(img);
        expect(call[1]).toBe(cd.x);
        expect(call[2]).toBe(cd.y);
        expect(call[3]).toBe(cd.width);
        expect(call[4]).toBe(cd.height);
        // x = -halfWidth, y = -halfHeight
        expect(call[5]).toBeCloseTo(-particle.frame.halfWidth);
        expect(call[6]).toBeCloseTo(-particle.frame.halfHeight);
        expect(call[7]).toBe(cd.width);
        expect(call[8]).toBe(cd.height);
    });

    it('should round x and y when camera.roundPixels is true', function ()
    {
        camera.roundPixels = true;
        var particle = makeParticle();
        particle.frame.halfWidth = 16.7;
        particle.frame.halfHeight = 16.3;
        emitter.alive = [particle];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        var call = ctx.drawImage.mock.calls[0];
        // x = -16.7 rounded = -17, y = -16.3 rounded = -16
        expect(call[5]).toBe(Math.round(-16.7));
        expect(call[6]).toBe(Math.round(-16.3));
    });

    it('should not round x and y when camera.roundPixels is false', function ()
    {
        camera.roundPixels = false;
        var particle = makeParticle();
        particle.frame.halfWidth = 16.7;
        particle.frame.halfHeight = 16.3;
        emitter.alive = [particle];

        ParticleEmitterCanvasRenderer(renderer, emitter, camera);

        var call = ctx.drawImage.mock.calls[0];
        expect(call[5]).toBeCloseTo(-16.7);
        expect(call[6]).toBeCloseTo(-16.3);
    });
});
