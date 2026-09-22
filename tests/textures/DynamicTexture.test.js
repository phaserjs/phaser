vi.mock('../../src/display/canvas/CanvasPool', function ()
{
    return {
        create2D: vi.fn(),
        remove: vi.fn()
    };
});

var CONST = require('../../src/const');
var DynamicTexture = require('../../src/textures/DynamicTexture');

function createMockRenderer ()
{
    var renderer = {
        type: CONST.WEBGL,
        gl: {
            EQUAL: 514,
            KEEP: 7680,
            NEAREST: 9728,
            LINEAR: 9729,
            CLAMP_TO_EDGE: 33071,
            REPEAT: 10497,
            RGBA: 6408
        },
        config: {
            antialias: true,
            alphaStrategy: 'keep'
        },
        blendModes: [
            { enable: false, equation: null, func: null }
        ],
        glTextureWrappers: [],
        createTextureFromSource: vi.fn(),
        createTexture2D: vi.fn(),
        createFramebuffer: vi.fn(),
        deleteTexture: vi.fn(),
        deleteFramebuffer: vi.fn(),
        renderNodes: {}
    };

    var createTexture = function (name)
    {
        var texture = { name: name };

        renderer.glTextureWrappers.push(texture);

        return texture;
    };

    renderer.createTextureFromSource.mockImplementation(function ()
    {
        renderer._sourceTexture = createTexture('texture-source-texture');

        return renderer._sourceTexture;
    });

    renderer.createTexture2D.mockImplementation(function ()
    {
        return createTexture('drawing-context-texture');
    });

    renderer.createFramebuffer.mockImplementation(function ()
    {
        return { name: 'drawing-context-framebuffer' };
    });

    renderer.deleteTexture.mockImplementation(function (texture)
    {
        var index = renderer.glTextureWrappers.indexOf(texture);

        if (index !== -1)
        {
            renderer.glTextureWrappers.splice(index, 1);
        }
    });

    return renderer;
}

function createMockManager (renderer)
{
    return {
        game: {
            renderer: renderer,
            config: {
                antialias: true
            },
            scene: {
                systemScene: {
                    sys: {
                        game: {
                            scene: {}
                        },
                        scale: null,
                        cameras: null
                    }
                }
            }
        },
        stamp: null,
        removeKey: vi.fn()
    };
}

describe('Phaser.Textures.DynamicTexture', function ()
{
    it('should release the replaced WebGL texture on every create and destroy cycle', function ()
    {
        var renderer = createMockRenderer();
        var manager = createMockManager(renderer);
        var baseline = renderer.glTextureWrappers.length;

        for (var i = 0; i < 4; i++)
        {
            var texture = new DynamicTexture(manager, 'dynamic-texture-' + i, 8, 8, false);

            expect(renderer.glTextureWrappers).toHaveLength(baseline + 1);
            expect(renderer.deleteTexture).toHaveBeenCalledWith(renderer._sourceTexture);

            texture.destroy();

            expect(renderer.glTextureWrappers).toHaveLength(baseline);
        }
    });
});
