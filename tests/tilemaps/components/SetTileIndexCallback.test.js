var SetTileIndexCallback = require('../../../src/tilemaps/components/SetTileIndexCallback');

describe('Phaser.Tilemaps.Components.SetTileIndexCallback', function ()
{
    var layer;
    var callback;
    var context;

    beforeEach(function ()
    {
        layer = { callbacks: [] };
        callback = function () {};
        context = { name: 'testContext' };
    });

    it('should set a callback for a single tile index', function ()
    {
        SetTileIndexCallback(5, callback, context, layer);

        expect(layer.callbacks[5]).toBeDefined();
        expect(layer.callbacks[5].callback).toBe(callback);
        expect(layer.callbacks[5].callbackContext).toBe(context);
    });

    it('should set a callback for tile index 0', function ()
    {
        SetTileIndexCallback(0, callback, context, layer);

        expect(layer.callbacks[0]).toBeDefined();
        expect(layer.callbacks[0].callback).toBe(callback);
        expect(layer.callbacks[0].callbackContext).toBe(context);
    });

    it('should remove a callback when null is passed for a single index', function ()
    {
        SetTileIndexCallback(5, callback, context, layer);
        SetTileIndexCallback(5, null, context, layer);

        expect(layer.callbacks[5]).toBeUndefined();
    });

    it('should replace an existing callback for a single index', function ()
    {
        var newCallback = function () { return 42; };

        SetTileIndexCallback(5, callback, context, layer);
        SetTileIndexCallback(5, newCallback, context, layer);

        expect(layer.callbacks[5].callback).toBe(newCallback);
    });

    it('should set callbacks for an array of tile indexes', function ()
    {
        SetTileIndexCallback([1, 2, 3], callback, context, layer);

        expect(layer.callbacks[1]).toBeDefined();
        expect(layer.callbacks[1].callback).toBe(callback);
        expect(layer.callbacks[1].callbackContext).toBe(context);

        expect(layer.callbacks[2]).toBeDefined();
        expect(layer.callbacks[2].callback).toBe(callback);
        expect(layer.callbacks[2].callbackContext).toBe(context);

        expect(layer.callbacks[3]).toBeDefined();
        expect(layer.callbacks[3].callback).toBe(callback);
        expect(layer.callbacks[3].callbackContext).toBe(context);
    });

    it('should remove callbacks for an array of tile indexes when null is passed', function ()
    {
        SetTileIndexCallback([1, 2, 3], callback, context, layer);
        SetTileIndexCallback([1, 2, 3], null, context, layer);

        expect(layer.callbacks[1]).toBeUndefined();
        expect(layer.callbacks[2]).toBeUndefined();
        expect(layer.callbacks[3]).toBeUndefined();
    });

    it('should only affect the specified indexes in an array', function ()
    {
        SetTileIndexCallback([1, 3, 5], callback, context, layer);

        expect(layer.callbacks[1]).toBeDefined();
        expect(layer.callbacks[2]).toBeUndefined();
        expect(layer.callbacks[3]).toBeDefined();
        expect(layer.callbacks[4]).toBeUndefined();
        expect(layer.callbacks[5]).toBeDefined();
    });

    it('should handle an array with a single element', function ()
    {
        SetTileIndexCallback([7], callback, context, layer);

        expect(layer.callbacks[7]).toBeDefined();
        expect(layer.callbacks[7].callback).toBe(callback);
    });

    it('should handle an empty array without errors', function ()
    {
        expect(function ()
        {
            SetTileIndexCallback([], callback, context, layer);
        }).not.toThrow();
    });

    it('should store the correct callbackContext for each index in an array', function ()
    {
        var ctx1 = { id: 1 };
        var ctx2 = { id: 2 };

        SetTileIndexCallback([10], callback, ctx1, layer);
        SetTileIndexCallback([20], callback, ctx2, layer);

        expect(layer.callbacks[10].callbackContext).toBe(ctx1);
        expect(layer.callbacks[20].callbackContext).toBe(ctx2);
    });

    it('should not affect other indexes when setting a callback for a single index', function ()
    {
        SetTileIndexCallback(5, callback, context, layer);

        expect(layer.callbacks[4]).toBeUndefined();
        expect(layer.callbacks[6]).toBeUndefined();
    });

    it('should handle a large tile index', function ()
    {
        SetTileIndexCallback(9999, callback, context, layer);

        expect(layer.callbacks[9999]).toBeDefined();
        expect(layer.callbacks[9999].callback).toBe(callback);
    });

    it('should accept a null callbackContext', function ()
    {
        SetTileIndexCallback(5, callback, null, layer);

        expect(layer.callbacks[5]).toBeDefined();
        expect(layer.callbacks[5].callbackContext).toBeNull();
    });
});
