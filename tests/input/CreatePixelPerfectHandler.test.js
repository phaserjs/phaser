var CreatePixelPerfectHandler = require('../../src/input/CreatePixelPerfectHandler');

describe('Phaser.Input.CreatePixelPerfectHandler', function ()
{
    var textureManager;
    var gameObject;
    var hitArea;

    beforeEach(function ()
    {
        textureManager = {
            getPixelAlpha: vi.fn()
        };

        gameObject = {
            texture: { key: 'testTexture' },
            frame: { name: 'testFrame' }
        };

        hitArea = {};
    });

    it('should return a function', function ()
    {
        var handler = CreatePixelPerfectHandler(textureManager, 1);

        expect(typeof handler).toBe('function');
    });

    it('should return true when alpha equals alphaTolerance', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(128);

        var handler = CreatePixelPerfectHandler(textureManager, 128);
        var result = handler(hitArea, 10, 20, gameObject);

        expect(result).toBe(true);
    });

    it('should return true when alpha is above alphaTolerance', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(200);

        var handler = CreatePixelPerfectHandler(textureManager, 128);
        var result = handler(hitArea, 10, 20, gameObject);

        expect(result).toBe(true);
    });

    it('should return false when alpha is below alphaTolerance', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(50);

        var handler = CreatePixelPerfectHandler(textureManager, 128);
        var result = handler(hitArea, 10, 20, gameObject);

        expect(result).toBe(false);
    });

    it('should return false when alpha is zero', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(0);

        var handler = CreatePixelPerfectHandler(textureManager, 1);
        var result = handler(hitArea, 10, 20, gameObject);

        expect(result).toBeFalsy();
    });

    it('should return false when alpha is null', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(null);

        var handler = CreatePixelPerfectHandler(textureManager, 1);
        var result = handler(hitArea, 10, 20, gameObject);

        expect(result).toBeFalsy();
    });

    it('should pass x and y coordinates to getPixelAlpha', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(255);

        var handler = CreatePixelPerfectHandler(textureManager, 1);
        handler(hitArea, 42, 99, gameObject);

        expect(textureManager.getPixelAlpha).toHaveBeenCalledWith(42, 99, 'testTexture', 'testFrame');
    });

    it('should pass texture key and frame name to getPixelAlpha', function ()
    {
        gameObject.texture.key = 'mySprite';
        gameObject.frame.name = 'frame_0';
        textureManager.getPixelAlpha.mockReturnValue(255);

        var handler = CreatePixelPerfectHandler(textureManager, 1);
        handler(hitArea, 0, 0, gameObject);

        expect(textureManager.getPixelAlpha).toHaveBeenCalledWith(0, 0, 'mySprite', 'frame_0');
    });

    it('should return true when alphaTolerance is 1 and alpha is 1', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(1);

        var handler = CreatePixelPerfectHandler(textureManager, 1);
        var result = handler(hitArea, 0, 0, gameObject);

        expect(result).toBe(true);
    });

    it('should return true when alphaTolerance is 255 and alpha is 255', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(255);

        var handler = CreatePixelPerfectHandler(textureManager, 255);
        var result = handler(hitArea, 0, 0, gameObject);

        expect(result).toBe(true);
    });

    it('should return false when alphaTolerance is 255 and alpha is 254', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(254);

        var handler = CreatePixelPerfectHandler(textureManager, 255);
        var result = handler(hitArea, 0, 0, gameObject);

        expect(result).toBe(false);
    });

    it('should call getPixelAlpha once per handler invocation', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(255);

        var handler = CreatePixelPerfectHandler(textureManager, 1);
        handler(hitArea, 0, 0, gameObject);

        expect(textureManager.getPixelAlpha).toHaveBeenCalledTimes(1);
    });

    it('should use the same textureManager across multiple calls', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(255);

        var handler = CreatePixelPerfectHandler(textureManager, 1);
        handler(hitArea, 0, 0, gameObject);
        handler(hitArea, 5, 5, gameObject);
        handler(hitArea, 10, 10, gameObject);

        expect(textureManager.getPixelAlpha).toHaveBeenCalledTimes(3);
    });

    it('should capture alphaTolerance at creation time', function ()
    {
        var tolerance = 100;
        textureManager.getPixelAlpha.mockReturnValue(99);

        var handler = CreatePixelPerfectHandler(textureManager, tolerance);
        var result = handler(hitArea, 0, 0, gameObject);

        expect(result).toBe(false);
    });

    it('should return independent handlers for different tolerances', function ()
    {
        textureManager.getPixelAlpha.mockReturnValue(100);

        var strictHandler = CreatePixelPerfectHandler(textureManager, 150);
        var looseHandler = CreatePixelPerfectHandler(textureManager, 50);

        expect(strictHandler(hitArea, 0, 0, gameObject)).toBe(false);
        expect(looseHandler(hitArea, 0, 0, gameObject)).toBe(true);
    });
});
