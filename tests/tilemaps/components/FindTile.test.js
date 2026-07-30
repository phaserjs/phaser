var FindTile = require('../../../src/tilemaps/components/FindTile');

describe('Phaser.Tilemaps.Components.FindTile', function ()
{
    var layer;
    var tiles;

    function makeTile (index)
    {
        return { index: index, collides: false, hasInterestingFace: false };
    }

    function makeLayer (rows)
    {
        return {
            width: rows[0].length,
            height: rows.length,
            data: rows
        };
    }

    beforeEach(function ()
    {
        tiles = [ makeTile(1), makeTile(2), makeTile(3) ];
        layer = makeLayer([ tiles ]);
    });

    it('should return the first tile for which the callback returns true', function ()
    {
        var result = FindTile(function (tile)
        {
            return tile.index === 2;
        }, null, 0, 0, 3, 1, {}, layer);

        expect(result).toBe(tiles[1]);
    });

    it('should return null when no tile satisfies the callback', function ()
    {
        var result = FindTile(function (tile)
        {
            return tile.index === 99;
        }, null, 0, 0, 3, 1, {}, layer);

        expect(result).toBeNull();
    });

    it('should return null when the tile array is empty', function ()
    {
        var emptyLayer = makeLayer([ [] ]);
        emptyLayer.width = 0;

        var result = FindTile(function ()
        {
            return true;
        }, null, 0, 0, 0, 1, {}, emptyLayer);

        expect(result).toBeNull();
    });

    it('should return the first matching tile when multiple tiles satisfy the callback', function ()
    {
        var result = FindTile(function (tile)
        {
            return tile.index > 1;
        }, null, 0, 0, 3, 1, {}, layer);

        expect(result).toBe(tiles[1]);
    });

    it('should pass the tile, index, and array to the callback', function ()
    {
        var callArgs = [];

        FindTile(function (tile, index, array)
        {
            callArgs.push({ tile: tile, index: index, array: array });
            return false;
        }, null, 0, 0, 3, 1, {}, layer);

        expect(callArgs.length).toBe(3);
        expect(callArgs[0].tile).toBe(tiles[0]);
        expect(callArgs[0].index).toBe(0);
        expect(callArgs[1].tile).toBe(tiles[1]);
        expect(callArgs[1].index).toBe(1);
        expect(callArgs[2].tile).toBe(tiles[2]);
        expect(callArgs[2].index).toBe(2);
    });

    it('should invoke the callback with the provided context', function ()
    {
        var context = { threshold: 2 };
        var capturedContext;

        FindTile(function ()
        {
            capturedContext = this;
            return false;
        }, context, 0, 0, 3, 1, {}, layer);

        expect(capturedContext).toBe(context);
    });

    it('should only search within the specified tileX, tileY, width, height area', function ()
    {
        var t1 = makeTile(10);
        var t2 = makeTile(20);
        var t3 = makeTile(30);
        var t4 = makeTile(40);
        var bigLayer = makeLayer([
            [ t1, t2 ],
            [ t3, t4 ]
        ]);

        // Only search bottom-right tile (tileX=1, tileY=1, width=1, height=1)
        var result = FindTile(function (tile)
        {
            return true;
        }, null, 1, 1, 1, 1, {}, bigLayer);

        expect(result).toBe(t4);
    });

    it('should return null when the callback always returns a falsy value', function ()
    {
        var result = FindTile(function ()
        {
            return 0;
        }, null, 0, 0, 3, 1, {}, layer);

        expect(result).toBeNull();
    });

    it('should stop iterating after the first matching tile is found', function ()
    {
        var callCount = 0;

        FindTile(function (tile)
        {
            callCount++;
            return tile.index === 1;
        }, null, 0, 0, 3, 1, {}, layer);

        expect(callCount).toBe(1);
    });

    it('should return null when no tile in the area matches the callback', function ()
    {
        var result = FindTile(function (tile)
        {
            return tile.index === 1;
        }, null, 0, 0, 3, 1, {}, makeLayer([ [ makeTile(5), makeTile(6) ] ]));

        expect(result).toBeNull();
    });
});
