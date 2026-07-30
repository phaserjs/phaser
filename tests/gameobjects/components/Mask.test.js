var Mask = require('../../../src/gameobjects/components/Mask');
var CONST = require('../../../src/const');
var GeometryMask = require('../../../src/display/mask/GeometryMask');

describe('Mask', function ()
{
    var gameObject;
    var mockScene;
    var mockMask;

    beforeEach(function ()
    {
        mockScene = {
            renderer: {
                type: CONST.CANVAS
            }
        };

        mockMask = {
            destroy: vi.fn()
        };

        gameObject = Object.assign({}, Mask, {
            scene: mockScene
        });
    });

    describe('mask property', function ()
    {
        it('should default to null', function ()
        {
            expect(Mask.mask).toBeNull();
        });
    });

    describe('setMask', function ()
    {
        it('should set the mask property', function ()
        {
            gameObject.setMask(mockMask);

            expect(gameObject.mask).toBe(mockMask);
        });

        it('should return the game object instance', function ()
        {
            var result = gameObject.setMask(mockMask);

            expect(result).toBe(gameObject);
        });

        it('should replace an existing mask', function ()
        {
            var firstMask = { destroy: vi.fn() };
            var secondMask = { destroy: vi.fn() };

            gameObject.setMask(firstMask);
            gameObject.setMask(secondMask);

            expect(gameObject.mask).toBe(secondMask);
        });

        it('should not set the mask and warn when renderer is WebGL', function ()
        {
            mockScene.renderer.type = CONST.WEBGL;

            var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

            var result = gameObject.setMask(mockMask);

            expect(gameObject.mask).toBeNull();
            expect(warnSpy).toHaveBeenCalledOnce();
            expect(result).toBe(gameObject);

            warnSpy.mockRestore();
        });

        it('should warn with the correct message when renderer is WebGL', function ()
        {
            mockScene.renderer.type = CONST.WEBGL;

            var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

            gameObject.setMask(mockMask);

            expect(warnSpy).toHaveBeenCalledWith(
                'Phaser.GameObjects.Components.Mask.setMask: This method is not supported in WebGL. Create a Mask filter instead.'
            );

            warnSpy.mockRestore();
        });

        it('should accept null as a mask value on canvas renderer', function ()
        {
            gameObject.setMask(mockMask);
            gameObject.setMask(null);

            expect(gameObject.mask).toBeNull();
        });
    });

    describe('clearMask', function ()
    {
        it('should set mask to null', function ()
        {
            gameObject.mask = mockMask;
            gameObject.clearMask();

            expect(gameObject.mask).toBeNull();
        });

        it('should return the game object instance', function ()
        {
            var result = gameObject.clearMask();

            expect(result).toBe(gameObject);
        });

        it('should not call destroy on the mask by default', function ()
        {
            gameObject.mask = mockMask;
            gameObject.clearMask();

            expect(mockMask.destroy).not.toHaveBeenCalled();
        });

        it('should not call destroy when destroyMask is false', function ()
        {
            gameObject.mask = mockMask;
            gameObject.clearMask(false);

            expect(mockMask.destroy).not.toHaveBeenCalled();
        });

        it('should call destroy on the mask when destroyMask is true', function ()
        {
            gameObject.mask = mockMask;
            gameObject.clearMask(true);

            expect(mockMask.destroy).toHaveBeenCalledOnce();
        });

        it('should still set mask to null when destroyMask is true', function ()
        {
            gameObject.mask = mockMask;
            gameObject.clearMask(true);

            expect(gameObject.mask).toBeNull();
        });

        it('should not throw when destroyMask is true and mask is null', function ()
        {
            gameObject.mask = null;

            expect(function ()
            {
                gameObject.clearMask(true);
            }).not.toThrow();
        });

        it('should return this when mask is already null', function ()
        {
            gameObject.mask = null;
            var result = gameObject.clearMask();

            expect(result).toBe(gameObject);
        });
    });

    describe('createGeometryMask', function ()
    {
        it('should return a GeometryMask instance', function ()
        {
            var graphics = {};
            var result = gameObject.createGeometryMask(graphics);

            expect(result).toBeInstanceOf(GeometryMask);
        });

        it('should pass the provided graphics to the GeometryMask', function ()
        {
            var graphics = {};
            var result = gameObject.createGeometryMask(graphics);

            expect(result.geometryMask).toBe(graphics);
        });

        it('should use itself when no graphics is provided and type is Graphics', function ()
        {
            gameObject.type = 'Graphics';
            var result = gameObject.createGeometryMask();

            expect(result.geometryMask).toBe(gameObject);
        });

        it('should use itself when no graphics is provided and geom property exists', function ()
        {
            gameObject.geom = {};
            var result = gameObject.createGeometryMask();

            expect(result.geometryMask).toBe(gameObject);
        });

        it('should pass undefined graphics when no graphics provided and not a Graphics object', function ()
        {
            gameObject.type = 'Sprite';
            var result = gameObject.createGeometryMask();

            expect(result.geometryMask).toBeUndefined();
        });

        it('should prefer the provided graphics argument over self-reference', function ()
        {
            var externalGraphics = {};
            gameObject.type = 'Graphics';
            var result = gameObject.createGeometryMask(externalGraphics);

            expect(result.geometryMask).toBe(externalGraphics);
        });

        it('should create a new GeometryMask each call', function ()
        {
            var graphics = {};
            var first = gameObject.createGeometryMask(graphics);
            var second = gameObject.createGeometryMask(graphics);

            expect(first).not.toBe(second);
        });
    });
});
