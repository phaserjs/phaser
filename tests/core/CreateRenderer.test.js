//  jsdom has no WebGLRenderingContext, so Phaser's feature detection reports
//  WebGL as unavailable and CreateRenderer never tries to build a WebGL
//  renderer. Define it before loading Phaser so detection passes (the
//  setup.js canvas mock returns an object for 'webgl' contexts), which lets
//  these tests exercise the "detection passed but context creation failed" path.
if (typeof window.WebGLRenderingContext === 'undefined')
{
    window.WebGLRenderingContext = function () {};
}

//  CreateRenderer pulls in the WebGL renderer and its render nodes, which
//  cannot be required from src directly (circular requires), so use the
//  built bundle like the Phaser Game tests do.
require('../../dist/phaser.js');

var Phaser = global.Phaser;

var Config = Phaser.Core.Config;
var CreateRenderer = Phaser.Core.CreateRenderer;
var CanvasRenderer = Phaser.Renderer.Canvas.CanvasRenderer;
var EventEmitter = Phaser.Events.EventEmitter;

describe('CreateRenderer', function ()
{
    var dispatchEvent;

    //  A WebGL context that reports itself as lost makes WebGLRenderer throw
    //  'WebGL unsupported' during construction, without touching a real context.
    var lostContext = {
        isContextLost: function () { return true; }
    };

    function makeGame (configOverrides)
    {
        var config = new Config(Object.assign({
            width: 64,
            height: 48,
            context: lostContext
        }, configOverrides || {}));

        return {
            config: config,
            scale: { baseSize: { width: 64, height: 48 } },
            events: new EventEmitter(),
            textures: new EventEmitter(),
            canvas: null,
            context: null,
            renderer: null
        };
    }

    beforeEach(function ()
    {
        //  The fallback reports the WebGL error via window.dispatchEvent. Intercept it,
        //  otherwise the test runner treats the dispatched ErrorEvent as an unhandled error.
        dispatchEvent = vi.spyOn(window, 'dispatchEvent').mockImplementation(function () { return true; });
    });

    afterEach(function ()
    {
        dispatchEvent.mockRestore();
    });

    describe('WebGL context failure', function ()
    {
        it('should fall back to CanvasRenderer when the type is AUTO', function ()
        {
            var game = makeGame({ type: Phaser.AUTO });

            CreateRenderer(game);

            expect(game.renderer).toBeInstanceOf(CanvasRenderer);
            expect(game.config.renderType).toBe(Phaser.CANVAS);
            expect(game.context).toBe(game.renderer.gameContext);
        });

        it('should dispatch the original error on window when falling back', function ()
        {
            var game = makeGame({ type: Phaser.AUTO });

            CreateRenderer(game);

            expect(dispatchEvent).toHaveBeenCalledTimes(1);

            var event = dispatchEvent.mock.calls[0][0];

            expect(event.type).toBe('error');
            expect(event.error).toBeInstanceOf(Error);
            expect(event.error.message).toBe('WebGL unsupported. Falling back to CanvasRenderer');
        });

        it('should still throw when the type is explicitly WEBGL', function ()
        {
            var game = makeGame({ type: Phaser.WEBGL });

            expect(function () { CreateRenderer(game); }).toThrow('WebGL unsupported');
            expect(game.renderer).toBeNull();
            expect(dispatchEvent).not.toHaveBeenCalled();
        });
    });
});
