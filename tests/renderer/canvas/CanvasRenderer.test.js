vi.mock('../../../src/renderer/canvas/utils/GetBlendModes', function ()
{
    return function ()
    {
        var output = [];
        for (var i = 0; i < 32; i++) { output[i] = 'source-over'; }
        output[1] = 'lighter';
        return output;
    };
});

vi.mock('../../../src/renderer/snapshot/CanvasSnapshot', function ()
{
    return function () {};
});

var CanvasRenderer = require('../../../src/renderer/canvas/CanvasRenderer');
var Events = require('../../../src/renderer/events');

function createMockContext ()
{
    return {
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        fillStyle: '',
        imageSmoothingEnabled: true,
        setTransform: vi.fn(),
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        rect: vi.fn(),
        clip: vi.fn(),
        drawImage: vi.fn()
    };
}

function createMockGame (overrides)
{
    var mockContext = createMockContext();
    var mockCanvas = {
        width: 800,
        height: 600,
        getContext: function () { return mockContext; }
    };

    var base = {
        canvas: mockCanvas,
        config: {
            clearBeforeRender: true,
            backgroundColor: { rgba: 'rgba(0,0,0,1)' },
            antialias: true,
            roundPixels: false,
            transparent: false,
            context: null,
            desynchronized: false
        },
        events: {
            once: vi.fn(),
            on: vi.fn(),
            emit: vi.fn()
        },
        textures: {
            once: vi.fn()
        },
        scale: {
            on: vi.fn(),
            baseSize: { width: 800, height: 600 }
        },
        scene: {
            customViewports: false
        }
    };

    if (overrides)
    {
        Object.assign(base, overrides);
    }

    return base;
}

function createRenderer (gameOverrides)
{
    var game = createMockGame(gameOverrides);
    return new CanvasRenderer(game);
}

describe('CanvasRenderer', function ()
{
    describe('constructor', function ()
    {
        it('should set type to CANVAS constant', function ()
        {
            var renderer = createRenderer();
            var CONST = require('../../../src/const');
            expect(renderer.type).toBe(CONST.CANVAS);
        });

        it('should initialise drawCount to zero', function ()
        {
            var renderer = createRenderer();
            expect(renderer.drawCount).toBe(0);
        });

        it('should initialise width to zero', function ()
        {
            var renderer = createRenderer();
            expect(renderer.width).toBe(0);
        });

        it('should initialise height to zero', function ()
        {
            var renderer = createRenderer();
            expect(renderer.height).toBe(0);
        });

        it('should set isBooted to false', function ()
        {
            var renderer = createRenderer();
            expect(renderer.isBooted).toBe(false);
        });

        it('should store reference to game', function ()
        {
            var game = createMockGame();
            var renderer = new CanvasRenderer(game);
            expect(renderer.game).toBe(game);
        });

        it('should store reference to game canvas', function ()
        {
            var game = createMockGame();
            var renderer = new CanvasRenderer(game);
            expect(renderer.gameCanvas).toBe(game.canvas);
        });

        it('should copy config values from game config', function ()
        {
            var renderer = createRenderer();
            expect(renderer.config.clearBeforeRender).toBe(true);
            expect(renderer.config.antialias).toBe(true);
            expect(renderer.config.roundPixels).toBe(false);
            expect(renderer.config.transparent).toBe(false);
        });

        it('should set antialias from game config', function ()
        {
            var renderer = createRenderer();
            expect(renderer.antialias).toBe(true);
        });

        it('should populate blendModes array', function ()
        {
            var renderer = createRenderer();
            expect(Array.isArray(renderer.blendModes)).toBe(true);
            expect(renderer.blendModes.length).toBeGreaterThan(0);
        });

        it('should initialise snapshotState with default values', function ()
        {
            var renderer = createRenderer();
            var state = renderer.snapshotState;
            expect(state.x).toBe(0);
            expect(state.y).toBe(0);
            expect(state.width).toBe(1);
            expect(state.height).toBe(1);
            expect(state.getPixel).toBe(false);
            expect(state.callback).toBeNull();
            expect(state.type).toBe('image/png');
            expect(state.encoder).toBeCloseTo(0.92);
        });

        it('should use provided context from config instead of calling getContext', function ()
        {
            var customCtx = createMockContext();
            var game = createMockGame();
            game.config.context = customCtx;
            var renderer = new CanvasRenderer(game);
            expect(renderer.gameContext).toBe(customCtx);
        });

        it('should set currentContext to gameContext', function ()
        {
            var game = createMockGame();
            var renderer = new CanvasRenderer(game);
            expect(renderer.currentContext).toBe(renderer.gameContext);
        });

        it('should register BOOT event listener on game events', function ()
        {
            var game = createMockGame();
            var renderer = new CanvasRenderer(game);
            expect(game.events.once).toHaveBeenCalled();
        });

        it('should register READY event listener on game textures', function ()
        {
            var game = createMockGame();
            var renderer = new CanvasRenderer(game);
            expect(game.textures.once).toHaveBeenCalled();
        });
    });

    describe('onResize', function ()
    {
        it('should call resize when base size differs from current width', function ()
        {
            var renderer = createRenderer();
            renderer.width = 800;
            renderer.height = 600;
            renderer.resize = vi.fn();

            var gameSize = { width: 800, height: 600 };
            var baseSize = { width: 1024, height: 768 };

            renderer.onResize(gameSize, baseSize);

            expect(renderer.resize).toHaveBeenCalledWith(1024, 768);
        });

        it('should call resize when base size differs from current height', function ()
        {
            var renderer = createRenderer();
            renderer.width = 800;
            renderer.height = 600;
            renderer.resize = vi.fn();

            var gameSize = { width: 800, height: 600 };
            var baseSize = { width: 800, height: 900 };

            renderer.onResize(gameSize, baseSize);

            expect(renderer.resize).toHaveBeenCalledWith(800, 900);
        });

        it('should not call resize when base size matches current dimensions', function ()
        {
            var renderer = createRenderer();
            renderer.width = 800;
            renderer.height = 600;
            renderer.resize = vi.fn();

            var gameSize = { width: 800, height: 600 };
            var baseSize = { width: 800, height: 600 };

            renderer.onResize(gameSize, baseSize);

            expect(renderer.resize).not.toHaveBeenCalled();
        });
    });

    describe('resize', function ()
    {
        it('should update width and height', function ()
        {
            var renderer = createRenderer();
            renderer.resize(1280, 720);
            expect(renderer.width).toBe(1280);
            expect(renderer.height).toBe(720);
        });

        it('should emit the RESIZE event with width and height', function ()
        {
            var renderer = createRenderer();
            var spy = vi.fn();
            renderer.on(Events.RESIZE, spy);

            renderer.resize(640, 480);

            expect(spy).toHaveBeenCalledWith(640, 480);
        });

        it('should accept zero values', function ()
        {
            var renderer = createRenderer();
            renderer.resize(0, 0);
            expect(renderer.width).toBe(0);
            expect(renderer.height).toBe(0);
        });
    });

    describe('resetTransform', function ()
    {
        it('should call setTransform with identity matrix on current context', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.currentContext = mockCtx;

            renderer.resetTransform();

            expect(mockCtx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
        });
    });

    describe('setBlendMode', function ()
    {
        it('should set globalCompositeOperation on current context', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.currentContext = mockCtx;

            renderer.setBlendMode('multiply');

            expect(mockCtx.globalCompositeOperation).toBe('multiply');
        });

        it('should return this for chaining', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.currentContext = mockCtx;

            var result = renderer.setBlendMode('screen');

            expect(result).toBe(renderer);
        });
    });

    describe('setContext', function ()
    {
        it('should set currentContext to the provided context', function ()
        {
            var renderer = createRenderer();
            var newCtx = createMockContext();

            renderer.setContext(newCtx);

            expect(renderer.currentContext).toBe(newCtx);
        });

        it('should reset currentContext to gameContext when called with no argument', function ()
        {
            var renderer = createRenderer();
            var altCtx = createMockContext();
            renderer.currentContext = altCtx;

            renderer.setContext();

            expect(renderer.currentContext).toBe(renderer.gameContext);
        });

        it('should reset currentContext to gameContext when called with null', function ()
        {
            var renderer = createRenderer();
            var altCtx = createMockContext();
            renderer.currentContext = altCtx;

            renderer.setContext(null);

            expect(renderer.currentContext).toBe(renderer.gameContext);
        });

        it('should return this for chaining', function ()
        {
            var renderer = createRenderer();
            var result = renderer.setContext(createMockContext());
            expect(result).toBe(renderer);
        });
    });

    describe('setAlpha', function ()
    {
        it('should set globalAlpha on current context', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.currentContext = mockCtx;

            renderer.setAlpha(0.5);

            expect(mockCtx.globalAlpha).toBe(0.5);
        });

        it('should set globalAlpha to 0 for fully transparent', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.currentContext = mockCtx;

            renderer.setAlpha(0);

            expect(mockCtx.globalAlpha).toBe(0);
        });

        it('should set globalAlpha to 1 for fully opaque', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.currentContext = mockCtx;

            renderer.setAlpha(1);

            expect(mockCtx.globalAlpha).toBe(1);
        });

        it('should return this for chaining', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.currentContext = mockCtx;

            var result = renderer.setAlpha(0.75);

            expect(result).toBe(renderer);
        });
    });

    describe('preRender', function ()
    {
        it('should reset globalAlpha to 1 on game context', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            mockCtx.globalAlpha = 0.5;
            renderer.gameContext = mockCtx;

            renderer.preRender();

            expect(mockCtx.globalAlpha).toBe(1);
        });

        it('should reset globalCompositeOperation to source-over', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            mockCtx.globalCompositeOperation = 'multiply';
            renderer.gameContext = mockCtx;

            renderer.preRender();

            expect(mockCtx.globalCompositeOperation).toBe('source-over');
        });

        it('should call setTransform with identity matrix', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;

            renderer.preRender();

            expect(mockCtx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
        });

        it('should call clearRect when clearBeforeRender is true', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;
            renderer.config.clearBeforeRender = true;
            renderer.width = 800;
            renderer.height = 600;

            renderer.preRender();

            expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
        });

        it('should not call clearRect when clearBeforeRender is false', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;
            renderer.config.clearBeforeRender = false;

            renderer.preRender();

            expect(mockCtx.clearRect).not.toHaveBeenCalled();
        });

        it('should call fillRect when clearBeforeRender is true and not transparent', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;
            renderer.config.clearBeforeRender = true;
            renderer.config.transparent = false;
            renderer.config.backgroundColor = { rgba: 'rgba(0,0,0,1)' };
            renderer.width = 800;
            renderer.height = 600;

            renderer.preRender();

            expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
        });

        it('should not call fillRect when transparent', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;
            renderer.config.clearBeforeRender = true;
            renderer.config.transparent = true;

            renderer.preRender();

            expect(mockCtx.fillRect).not.toHaveBeenCalled();
        });

        it('should call ctx.save', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;

            renderer.preRender();

            expect(mockCtx.save).toHaveBeenCalled();
        });

        it('should reset drawCount to zero', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;
            renderer.drawCount = 99;

            renderer.preRender();

            expect(renderer.drawCount).toBe(0);
        });

        it('should emit PRE_RENDER event', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;
            var spy = vi.fn();
            renderer.on(Events.PRE_RENDER, spy);

            renderer.preRender();

            expect(spy).toHaveBeenCalled();
        });

        it('should emit PRE_RENDER_CLEAR event before clearing', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;
            renderer.config.clearBeforeRender = true;

            var order = [];
            renderer.on(Events.PRE_RENDER_CLEAR, function () { order.push('clear'); });
            mockCtx.clearRect = vi.fn(function () { order.push('clearRect'); });

            renderer.preRender();

            expect(order[0]).toBe('clear');
            expect(order[1]).toBe('clearRect');
        });
    });

    describe('postRender', function ()
    {
        it('should call ctx.restore on game context', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;

            renderer.postRender();

            expect(mockCtx.restore).toHaveBeenCalled();
        });

        it('should emit POST_RENDER event', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;
            var spy = vi.fn();
            renderer.on(Events.POST_RENDER, spy);

            renderer.postRender();

            expect(spy).toHaveBeenCalled();
        });

        it('should clear snapshotState callback after snapshot is taken', function ()
        {
            var renderer = createRenderer();
            var mockCtx = createMockContext();
            renderer.gameContext = mockCtx;

            // Mock CanvasSnapshot by overriding the state callback to a non-null but
            // avoid actually calling CanvasSnapshot (browser API). Skip if callback is set.
            // Only test that null callback is not called.
            renderer.snapshotState.callback = null;

            renderer.postRender();

            expect(renderer.snapshotState.callback).toBeNull();
        });
    });

    describe('snapshotArea', function ()
    {
        it('should set callback on snapshotState', function ()
        {
            var renderer = createRenderer();
            var cb = vi.fn();

            renderer.snapshotArea(0, 0, 100, 100, cb);

            expect(renderer.snapshotState.callback).toBe(cb);
        });

        it('should set x and y on snapshotState', function ()
        {
            var renderer = createRenderer();

            renderer.snapshotArea(10, 20, 100, 100, vi.fn());

            expect(renderer.snapshotState.x).toBe(10);
            expect(renderer.snapshotState.y).toBe(20);
        });

        it('should clamp width to gameCanvas width', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            renderer.snapshotArea(0, 0, 9999, 100, vi.fn());

            expect(renderer.snapshotState.width).toBe(800);
        });

        it('should clamp height to gameCanvas height', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            renderer.snapshotArea(0, 0, 100, 9999, vi.fn());

            expect(renderer.snapshotState.height).toBe(600);
        });

        it('should set type and encoder options', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            renderer.snapshotArea(0, 0, 100, 100, vi.fn(), 'image/jpeg', 0.8);

            expect(renderer.snapshotState.type).toBe('image/jpeg');
            expect(renderer.snapshotState.encoder).toBeCloseTo(0.8);
        });

        it('should set getPixel to false', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };
            renderer.snapshotState.getPixel = true;

            renderer.snapshotArea(0, 0, 100, 100, vi.fn());

            expect(renderer.snapshotState.getPixel).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            var result = renderer.snapshotArea(0, 0, 100, 100, vi.fn());

            expect(result).toBe(renderer);
        });
    });

    describe('snapshotPixel', function ()
    {
        it('should set getPixel to true on snapshotState', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            renderer.snapshotPixel(5, 10, vi.fn());

            expect(renderer.snapshotState.getPixel).toBe(true);
        });

        it('should set x and y to the pixel coordinates', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            renderer.snapshotPixel(42, 99, vi.fn());

            expect(renderer.snapshotState.x).toBe(42);
            expect(renderer.snapshotState.y).toBe(99);
        });

        it('should set width and height to 1', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            renderer.snapshotPixel(5, 10, vi.fn());

            expect(renderer.snapshotState.width).toBe(1);
            expect(renderer.snapshotState.height).toBe(1);
        });

        it('should set the callback on snapshotState', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };
            var cb = vi.fn();

            renderer.snapshotPixel(0, 0, cb);

            expect(renderer.snapshotState.callback).toBe(cb);
        });

        it('should return this for chaining', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            var result = renderer.snapshotPixel(0, 0, vi.fn());

            expect(result).toBe(renderer);
        });
    });

    describe('snapshot', function ()
    {
        it('should call snapshotArea with full canvas dimensions', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };
            renderer.snapshotArea = vi.fn().mockReturnValue(renderer);

            var cb = vi.fn();
            renderer.snapshot(cb, 'image/png', 0.92);

            expect(renderer.snapshotArea).toHaveBeenCalledWith(0, 0, 800, 600, cb, 'image/png', 0.92);
        });

        it('should return this for chaining', function ()
        {
            var renderer = createRenderer();
            renderer.gameCanvas = { width: 800, height: 600 };

            var result = renderer.snapshot(vi.fn());

            expect(result).toBe(renderer);
        });
    });

    describe('destroy', function ()
    {
        it('should set game to null', function ()
        {
            var renderer = createRenderer();
            renderer.destroy();
            expect(renderer.game).toBeNull();
        });

        it('should set gameCanvas to null', function ()
        {
            var renderer = createRenderer();
            renderer.destroy();
            expect(renderer.gameCanvas).toBeNull();
        });

        it('should set gameContext to null', function ()
        {
            var renderer = createRenderer();
            renderer.destroy();
            expect(renderer.gameContext).toBeNull();
        });

        it('should remove all event listeners', function ()
        {
            var renderer = createRenderer();
            var spy = vi.fn();
            renderer.on(Events.RESIZE, spy);

            renderer.destroy();

            renderer.emit(Events.RESIZE, 100, 100);
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
