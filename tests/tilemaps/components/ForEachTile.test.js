var ForEachTile = require('../../../src/tilemaps/components/ForEachTile');

describe('Phaser.Tilemaps.Components.ForEachTile', function ()
{
    var mockLayer;
    var tile1, tile2, tile3;

    beforeEach(function ()
    {
        tile1 = { index: 1, x: 0, y: 0, collides: false, hasInterestingFace: false };
        tile2 = { index: 2, x: 1, y: 0, collides: false, hasInterestingFace: false };
        tile3 = { index: 3, x: 2, y: 0, collides: false, hasInterestingFace: false };

        mockLayer = {
            data: [
                [ tile1, tile2, tile3 ]
            ],
            width: 3,
            height: 1
        };
    });

    it('should call GetTilesWithin with the correct arguments', function ()
    {
        var visited = [];
        var callback = function (tile) { visited.push(tile); };

        ForEachTile(callback, null, 1, 0, 2, 1, {}, mockLayer);

        expect(visited.length).toBe(2);
        expect(visited[0]).toBe(tile2);
        expect(visited[1]).toBe(tile3);
    });

    it('should invoke the callback for each tile returned', function ()
    {
        var callback = vi.fn();

        ForEachTile(callback, null, 0, 0, 3, 1, {}, mockLayer);

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should pass tile, index, and array to each callback invocation', function ()
    {
        var calls = [];

        var callback = function (tile, index, array)
        {
            calls.push({ tile: tile, index: index, array: array });
        };

        ForEachTile(callback, null, 0, 0, 3, 1, {}, mockLayer);

        expect(calls[0].tile).toBe(tile1);
        expect(calls[0].index).toBe(0);
        expect(calls[0].array).toEqual([ tile1, tile2, tile3 ]);

        expect(calls[1].tile).toBe(tile2);
        expect(calls[1].index).toBe(1);

        expect(calls[2].tile).toBe(tile3);
        expect(calls[2].index).toBe(2);
    });

    it('should invoke the callback with the given context', function ()
    {
        var context = { value: 42 };
        var capturedContexts = [];

        var callback = function ()
        {
            capturedContexts.push(this);
        };

        ForEachTile(callback, context, 0, 0, 3, 1, {}, mockLayer);

        expect(capturedContexts[0]).toBe(context);
        expect(capturedContexts[1]).toBe(context);
        expect(capturedContexts[2]).toBe(context);
    });

    it('should not invoke the callback when GetTilesWithin returns an empty array', function ()
    {
        var callback = vi.fn();

        ForEachTile(callback, null, 0, 0, 0, 0, {}, mockLayer);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should handle a single tile returned by GetTilesWithin', function ()
    {
        var callback = vi.fn();

        ForEachTile(callback, null, 0, 0, 1, 1, {}, mockLayer);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(tile1, 0, [ tile1 ]);
    });

    it('should pass filteringOptions through to GetTilesWithin', function ()
    {
        tile1.index = -1;
        var filteringOptions = { isNotEmpty: true };
        var callback = vi.fn();

        ForEachTile(callback, null, 0, 0, 3, 1, filteringOptions, mockLayer);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).not.toHaveBeenCalledWith(tile1, expect.anything(), expect.anything());
    });

    it('should allow mutation of tile properties inside the callback', function ()
    {
        var callback = function (tile)
        {
            tile.visited = true;
        };

        ForEachTile(callback, null, 0, 0, 3, 1, {}, mockLayer);

        expect(tile1.visited).toBe(true);
        expect(tile2.visited).toBe(true);
        expect(tile3.visited).toBe(true);
    });

    it('should work with a null context', function ()
    {
        var callback = vi.fn();

        expect(function ()
        {
            ForEachTile(callback, null, 0, 0, 3, 1, {}, mockLayer);
        }).not.toThrow();

        expect(callback).toHaveBeenCalledTimes(3);
    });
});
