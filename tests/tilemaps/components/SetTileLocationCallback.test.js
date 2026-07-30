var SetTileLocationCallback = require('../../../src/tilemaps/components/SetTileLocationCallback');

function makeTile ()
{
    return { setCollisionCallback: vi.fn(), index: 1, collides: false, hasInterestingFace: false };
}

function makeLayer (width, height)
{
    var data = [];

    for (var y = 0; y < height; y++)
    {
        data[y] = [];

        for (var x = 0; x < width; x++)
        {
            data[y][x] = makeTile();
        }
    }

    return { width: width, height: height, data: data };
}

describe('Phaser.Tilemaps.Components.SetTileLocationCallback', function ()
{
    it('should call setCollisionCallback on each tile in the region', function ()
    {
        var layer = makeLayer(3, 1);
        var callback = function () {};
        var context = {};

        SetTileLocationCallback(0, 0, 3, 1, callback, context, layer);

        expect(layer.data[0][0].setCollisionCallback).toHaveBeenCalledWith(callback, context);
        expect(layer.data[0][1].setCollisionCallback).toHaveBeenCalledWith(callback, context);
        expect(layer.data[0][2].setCollisionCallback).toHaveBeenCalledWith(callback, context);
    });

    it('should pass null callback to setCollisionCallback to remove it', function ()
    {
        var layer = makeLayer(3, 1);
        var context = {};

        SetTileLocationCallback(0, 0, 3, 1, null, context, layer);

        expect(layer.data[0][0].setCollisionCallback).toHaveBeenCalledWith(null, context);
        expect(layer.data[0][1].setCollisionCallback).toHaveBeenCalledWith(null, context);
        expect(layer.data[0][2].setCollisionCallback).toHaveBeenCalledWith(null, context);
    });

    it('should pass the callback context correctly', function ()
    {
        var layer = makeLayer(1, 1);
        var callback = function () {};
        var context = { someValue: 42 };

        SetTileLocationCallback(0, 0, 1, 1, callback, context, layer);

        expect(layer.data[0][0].setCollisionCallback).toHaveBeenCalledWith(callback, context);
    });

    it('should not call setCollisionCallback if region is empty', function ()
    {
        var layer = makeLayer(3, 1);
        var callback = function () {};
        var context = {};

        SetTileLocationCallback(0, 0, 0, 0, callback, context, layer);

        expect(layer.data[0][0].setCollisionCallback).not.toHaveBeenCalled();
        expect(layer.data[0][1].setCollisionCallback).not.toHaveBeenCalled();
        expect(layer.data[0][2].setCollisionCallback).not.toHaveBeenCalled();
    });

    it('should handle a single tile', function ()
    {
        var layer = makeLayer(5, 5);
        var callback = function () {};
        var context = {};

        SetTileLocationCallback(1, 1, 1, 1, callback, context, layer);

        expect(layer.data[1][1].setCollisionCallback).toHaveBeenCalledTimes(1);
        expect(layer.data[1][1].setCollisionCallback).toHaveBeenCalledWith(callback, context);
    });

    it('should call setCollisionCallback exactly once per tile', function ()
    {
        var layer = makeLayer(3, 1);
        var callback = function () {};
        var context = {};

        SetTileLocationCallback(0, 0, 3, 1, callback, context, layer);

        expect(layer.data[0][0].setCollisionCallback).toHaveBeenCalledTimes(1);
        expect(layer.data[0][1].setCollisionCallback).toHaveBeenCalledTimes(1);
        expect(layer.data[0][2].setCollisionCallback).toHaveBeenCalledTimes(1);
    });

    it('should only affect tiles within the specified region', function ()
    {
        var layer = makeLayer(5, 1);
        var callback = function () {};
        var context = {};

        SetTileLocationCallback(1, 0, 2, 1, callback, context, layer);

        expect(layer.data[0][0].setCollisionCallback).not.toHaveBeenCalled();
        expect(layer.data[0][1].setCollisionCallback).toHaveBeenCalledWith(callback, context);
        expect(layer.data[0][2].setCollisionCallback).toHaveBeenCalledWith(callback, context);
        expect(layer.data[0][3].setCollisionCallback).not.toHaveBeenCalled();
        expect(layer.data[0][4].setCollisionCallback).not.toHaveBeenCalled();
    });

    it('should not affect tiles outside the layer bounds', function ()
    {
        var layer = makeLayer(2, 2);
        var callback = function () {};
        var context = {};

        SetTileLocationCallback(5, 10, 2, 2, callback, context, layer);

        expect(layer.data[0][0].setCollisionCallback).not.toHaveBeenCalled();
        expect(layer.data[0][1].setCollisionCallback).not.toHaveBeenCalled();
        expect(layer.data[1][0].setCollisionCallback).not.toHaveBeenCalled();
        expect(layer.data[1][1].setCollisionCallback).not.toHaveBeenCalled();
    });
});
