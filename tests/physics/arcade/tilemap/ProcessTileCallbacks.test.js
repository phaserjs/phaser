var ProcessTileCallbacks = require('../../../../src/physics/arcade/tilemap/ProcessTileCallbacks');

describe('Phaser.Physics.Arcade.Tilemap.ProcessTileCallbacks', function ()
{
    var sprite;
    var tile;

    beforeEach(function ()
    {
        sprite = { name: 'testSprite' };

        tile = {
            index: 1,
            collisionCallback: null,
            collisionCallbackContext: null,
            layer: {
                callbacks: {}
            }
        };
    });

    it('should return true when no callbacks are registered', function ()
    {
        expect(ProcessTileCallbacks(tile, sprite)).toBe(true);
    });

    it('should invoke tile collisionCallback with sprite and tile as arguments', function ()
    {
        var receivedSprite = null;
        var receivedTile = null;

        tile.collisionCallback = function (s, t)
        {
            receivedSprite = s;
            receivedTile = t;
            return false;
        };

        ProcessTileCallbacks(tile, sprite);

        expect(receivedSprite).toBe(sprite);
        expect(receivedTile).toBe(tile);
    });

    it('should return true when tile collisionCallback returns false', function ()
    {
        tile.collisionCallback = function ()
        {
            return false;
        };

        expect(ProcessTileCallbacks(tile, sprite)).toBe(true);
    });

    it('should return false when tile collisionCallback returns true', function ()
    {
        tile.collisionCallback = function ()
        {
            return true;
        };

        expect(ProcessTileCallbacks(tile, sprite)).toBe(false);
    });

    it('should call tile collisionCallback with the correct context', function ()
    {
        var context = { foo: 'bar' };
        var capturedThis = null;

        tile.collisionCallback = function ()
        {
            capturedThis = this;
            return false;
        };
        tile.collisionCallbackContext = context;

        ProcessTileCallbacks(tile, sprite);

        expect(capturedThis).toBe(context);
    });

    it('should use tile callback over layer callback when both are registered', function ()
    {
        var tileCallbackCalled = false;
        var layerCallbackCalled = false;

        tile.collisionCallback = function ()
        {
            tileCallbackCalled = true;
            return false;
        };

        tile.layer.callbacks[tile.index] = {
            callback: function ()
            {
                layerCallbackCalled = true;
                return false;
            },
            callbackContext: null
        };

        ProcessTileCallbacks(tile, sprite);

        expect(tileCallbackCalled).toBe(true);
        expect(layerCallbackCalled).toBe(false);
    });

    it('should invoke layer callback when no tile callback is set', function ()
    {
        var receivedSprite = null;
        var receivedTile = null;

        tile.layer.callbacks[tile.index] = {
            callback: function (s, t)
            {
                receivedSprite = s;
                receivedTile = t;
                return false;
            },
            callbackContext: null
        };

        ProcessTileCallbacks(tile, sprite);

        expect(receivedSprite).toBe(sprite);
        expect(receivedTile).toBe(tile);
    });

    it('should return true when layer callback returns false', function ()
    {
        tile.layer.callbacks[tile.index] = {
            callback: function ()
            {
                return false;
            },
            callbackContext: null
        };

        expect(ProcessTileCallbacks(tile, sprite)).toBe(true);
    });

    it('should return false when layer callback returns true', function ()
    {
        tile.layer.callbacks[tile.index] = {
            callback: function ()
            {
                return true;
            },
            callbackContext: null
        };

        expect(ProcessTileCallbacks(tile, sprite)).toBe(false);
    });

    it('should call layer callback with the correct context', function ()
    {
        var context = { baz: 'qux' };
        var capturedThis = null;

        tile.layer.callbacks[tile.index] = {
            callback: function ()
            {
                capturedThis = this;
                return false;
            },
            callbackContext: context
        };

        ProcessTileCallbacks(tile, sprite);

        expect(capturedThis).toBe(context);
    });

    it('should return true when layer has no callback for the tile index', function ()
    {
        tile.layer.callbacks[99] = {
            callback: function ()
            {
                return true;
            },
            callbackContext: null
        };

        expect(ProcessTileCallbacks(tile, sprite)).toBe(true);
    });

    it('should handle tile index 0 with a layer callback', function ()
    {
        tile.index = 0;

        tile.layer.callbacks[0] = {
            callback: function ()
            {
                return true;
            },
            callbackContext: null
        };

        expect(ProcessTileCallbacks(tile, sprite)).toBe(false);
    });
});
