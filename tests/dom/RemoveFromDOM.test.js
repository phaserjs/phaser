var RemoveFromDOM = require('../../src/dom/RemoveFromDOM');

describe('Phaser.DOM.RemoveFromDOM', function ()
{
    it('should call removeChild on the parentNode when parentNode exists', function ()
    {
        var element = {
            parentNode: {
                removeChild: vi.fn()
            }
        };

        RemoveFromDOM(element);

        expect(element.parentNode.removeChild).toHaveBeenCalledWith(element);
    });

    it('should call removeChild exactly once', function ()
    {
        var element = {
            parentNode: {
                removeChild: vi.fn()
            }
        };

        RemoveFromDOM(element);

        expect(element.parentNode.removeChild).toHaveBeenCalledTimes(1);
    });

    it('should not throw when parentNode is null', function ()
    {
        var element = { parentNode: null };

        expect(function () { RemoveFromDOM(element); }).not.toThrow();
    });

    it('should not throw when parentNode is undefined', function ()
    {
        var element = { parentNode: undefined };

        expect(function () { RemoveFromDOM(element); }).not.toThrow();
    });

    it('should not throw when parentNode is falsy (0)', function ()
    {
        var element = { parentNode: 0 };

        expect(function () { RemoveFromDOM(element); }).not.toThrow();
    });

    it('should not call removeChild when parentNode is null', function ()
    {
        var removeChild = vi.fn();
        var element = { parentNode: null };

        RemoveFromDOM(element);

        expect(removeChild).not.toHaveBeenCalled();
    });

    it('should pass the element itself as the argument to removeChild', function ()
    {
        var capturedArg = null;
        var element = {
            parentNode: {
                removeChild: function (child) { capturedArg = child; }
            }
        };

        RemoveFromDOM(element);

        expect(capturedArg).toBe(element);
    });
});
