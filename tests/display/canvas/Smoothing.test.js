var Smoothing = require('../../../src/display/canvas/Smoothing');

describe('Phaser.Display.Canvas.Smoothing.getPrefix', function ()
{
    it('should return imageSmoothingEnabled when present on context', function ()
    {
        var context = { imageSmoothingEnabled: true };

        expect(Smoothing.getPrefix(context)).toBe('imageSmoothingEnabled');
    });

    it('should return webkitImageSmoothingEnabled when that is the only vendor prefix present', function ()
    {
        var context = { webkitImageSmoothingEnabled: true };

        expect(Smoothing.getPrefix(context)).toBe('webkitImageSmoothingEnabled');
    });

    it('should return msImageSmoothingEnabled when that is the only vendor prefix present', function ()
    {
        var context = { msImageSmoothingEnabled: false };

        expect(Smoothing.getPrefix(context)).toBe('msImageSmoothingEnabled');
    });

    it('should return mozImageSmoothingEnabled when that is the only vendor prefix present', function ()
    {
        var context = { mozImageSmoothingEnabled: true };

        expect(Smoothing.getPrefix(context)).toBe('mozImageSmoothingEnabled');
    });

    it('should return oImageSmoothingEnabled when that is the only vendor prefix present', function ()
    {
        var context = { oImageSmoothingEnabled: false };

        expect(Smoothing.getPrefix(context)).toBe('oImageSmoothingEnabled');
    });

    it('should return null when no smoothing property is present on context', function ()
    {
        var context = { someOtherProp: true };

        expect(Smoothing.getPrefix(context)).toBeNull();
    });

    it('should prefer imageSmoothingEnabled over vendor-prefixed versions', function ()
    {
        var context = {
            imageSmoothingEnabled: true,
            webkitImageSmoothingEnabled: true,
            msImageSmoothingEnabled: true
        };

        expect(Smoothing.getPrefix(context)).toBe('imageSmoothingEnabled');
    });

    it('should return the first matching vendor prefix when standard property is absent', function ()
    {
        var context = {
            webkitImageSmoothingEnabled: true,
            msImageSmoothingEnabled: true
        };

        expect(Smoothing.getPrefix(context)).toBe('webkitImageSmoothingEnabled');
    });

    it('should work with an empty context object', function ()
    {
        var context = {};

        expect(Smoothing.getPrefix(context)).toBeNull();
    });

    it('should detect the property even when its value is false', function ()
    {
        var context = { imageSmoothingEnabled: false };

        expect(Smoothing.getPrefix(context)).toBe('imageSmoothingEnabled');
    });
});

describe('Phaser.Display.Canvas.Smoothing.enable', function ()
{
    it('should return the context', function ()
    {
        var context = { imageSmoothingEnabled: false };
        var result = Smoothing.enable(context);

        expect(result).toBe(context);
    });

    it('should set imageSmoothingEnabled to true on a standard context', function ()
    {
        var context = { imageSmoothingEnabled: false };

        Smoothing.enable(context);

        expect(context.imageSmoothingEnabled).toBe(true);
    });

    it('should not throw when context has no smoothing property', function ()
    {
        var context = {};

        expect(function ()
        {
            Smoothing.enable(context);
        }).not.toThrow();
    });

    it('should return the context unchanged when no smoothing property is supported', function ()
    {
        var context = { someOtherProp: 42 };
        var result = Smoothing.enable(context);

        expect(result).toBe(context);
        expect(context.someOtherProp).toBe(42);
    });
});

describe('Phaser.Display.Canvas.Smoothing.disable', function ()
{
    it('should return the context', function ()
    {
        var context = { imageSmoothingEnabled: true };
        var result = Smoothing.disable(context);

        expect(result).toBe(context);
    });

    it('should set imageSmoothingEnabled to false on a standard context', function ()
    {
        var context = { imageSmoothingEnabled: true };

        Smoothing.disable(context);

        expect(context.imageSmoothingEnabled).toBe(false);
    });

    it('should not throw when context has no smoothing property', function ()
    {
        var context = {};

        expect(function ()
        {
            Smoothing.disable(context);
        }).not.toThrow();
    });

    it('should return the context unchanged when no smoothing property is supported', function ()
    {
        var context = { someOtherProp: 99 };
        var result = Smoothing.disable(context);

        expect(result).toBe(context);
        expect(context.someOtherProp).toBe(99);
    });
});

describe('Phaser.Display.Canvas.Smoothing.isEnabled', function ()
{
    it('should return true after enable is called on a standard context', function ()
    {
        var context = { imageSmoothingEnabled: false };

        Smoothing.enable(context);

        expect(Smoothing.isEnabled(context)).toBe(true);
    });

    it('should return false after disable is called on a standard context', function ()
    {
        var context = { imageSmoothingEnabled: true };

        Smoothing.disable(context);

        expect(Smoothing.isEnabled(context)).toBe(false);
    });

    it('should reflect the current value of imageSmoothingEnabled on the context', function ()
    {
        var context = { imageSmoothingEnabled: true };

        Smoothing.enable(context);
        expect(Smoothing.isEnabled(context)).toBe(true);

        Smoothing.disable(context);
        expect(Smoothing.isEnabled(context)).toBe(false);

        Smoothing.enable(context);
        expect(Smoothing.isEnabled(context)).toBe(true);
    });

    it('should read the value directly from the context property', function ()
    {
        var context = { imageSmoothingEnabled: true };

        Smoothing.enable(context);
        context.imageSmoothingEnabled = false;

        expect(Smoothing.isEnabled(context)).toBe(false);
    });
});
