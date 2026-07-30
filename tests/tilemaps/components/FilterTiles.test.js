var FilterTiles = require('../../../src/tilemaps/components/FilterTiles');

describe('Phaser.Tilemaps.Components.FilterTiles', function ()
{
    var layer;

    function makeTile(index, collides, hasInterestingFace)
    {
        return {
            index: index !== undefined ? index : 1,
            collides: collides !== undefined ? collides : false,
            hasInterestingFace: hasInterestingFace !== undefined ? hasInterestingFace : false
        };
    }

    function makeLayer(data)
    {
        return {
            width: data[0].length,
            height: data.length,
            data: data
        };
    }

    beforeEach(function ()
    {
        layer = makeLayer([
            [ makeTile(1), makeTile(2), makeTile(3) ],
            [ makeTile(4), makeTile(5), makeTile(6) ],
            [ makeTile(7), makeTile(8), makeTile(9) ]
        ]);
    });

    it('should return tiles that pass the callback filter', function ()
    {
        var result = FilterTiles(function (tile) { return tile.index > 5; }, null, 0, 0, 3, 3, {}, layer);

        expect(result.length).toBe(4);
        expect(result[0].index).toBe(6);
        expect(result[1].index).toBe(7);
        expect(result[2].index).toBe(8);
        expect(result[3].index).toBe(9);
    });

    it('should return an empty array when no tiles pass the filter', function ()
    {
        var result = FilterTiles(function (tile) { return tile.index > 100; }, null, 0, 0, 3, 3, {}, layer);

        expect(result).toEqual([]);
    });

    it('should return all tiles when callback always returns true', function ()
    {
        var result = FilterTiles(function () { return true; }, null, 0, 0, 3, 3, {}, layer);

        expect(result.length).toBe(9);
    });

    it('should respect the tileX and tileY origin', function ()
    {
        var result = FilterTiles(function () { return true; }, null, 1, 1, 2, 2, {}, layer);

        expect(result.length).toBe(4);
        expect(result[0].index).toBe(5);
        expect(result[1].index).toBe(6);
        expect(result[2].index).toBe(8);
        expect(result[3].index).toBe(9);
    });

    it('should respect the width and height parameters', function ()
    {
        var result = FilterTiles(function () { return true; }, null, 0, 0, 1, 1, {}, layer);

        expect(result.length).toBe(1);
        expect(result[0].index).toBe(1);
    });

    it('should call the callback with the correct context', function ()
    {
        var ctx = { multiplier: 5 };
        var capturedContext;

        FilterTiles(function (tile)
        {
            capturedContext = this;
            return true;
        }, ctx, 0, 0, 1, 1, {}, layer);

        expect(capturedContext).toBe(ctx);
    });

    it('should filter a single-row area correctly', function ()
    {
        var result = FilterTiles(function (tile) { return tile.index % 2 === 0; }, null, 0, 0, 3, 1, {}, layer);

        expect(result.length).toBe(1);
        expect(result[0].index).toBe(2);
    });

    it('should filter a single-column area correctly', function ()
    {
        var result = FilterTiles(function (tile) { return tile.index > 4; }, null, 0, 0, 1, 3, {}, layer);

        expect(result.length).toBe(1);
        expect(result[0].index).toBe(7);
    });

    it('should skip null tiles from the layer data', function ()
    {
        layer.data[1][1] = null;

        var result = FilterTiles(function () { return true; }, null, 0, 0, 3, 3, {}, layer);

        expect(result.length).toBe(8);
    });

    it('should apply isNotEmpty filtering option to exclude index -1 tiles', function ()
    {
        layer.data[0][0] = makeTile(-1);
        layer.data[1][1] = makeTile(-1);

        var result = FilterTiles(function () { return true; }, null, 0, 0, 3, 3, { isNotEmpty: true }, layer);

        expect(result.length).toBe(7);
        result.forEach(function (tile)
        {
            expect(tile.index).not.toBe(-1);
        });
    });

    it('should apply isColliding filtering option', function ()
    {
        layer.data[0][0] = makeTile(1, true, false);
        layer.data[2][2] = makeTile(9, true, false);

        var result = FilterTiles(function () { return true; }, null, 0, 0, 3, 3, { isColliding: true }, layer);

        expect(result.length).toBe(2);
        expect(result[0].index).toBe(1);
        expect(result[1].index).toBe(9);
    });

    it('should apply hasInterestingFace filtering option', function ()
    {
        layer.data[0][1] = makeTile(2, false, true);
        layer.data[1][2] = makeTile(6, false, true);

        var result = FilterTiles(function () { return true; }, null, 0, 0, 3, 3, { hasInterestingFace: true }, layer);

        expect(result.length).toBe(2);
        expect(result[0].index).toBe(2);
        expect(result[1].index).toBe(6);
    });

    it('should combine filtering options and callback filter', function ()
    {
        layer.data[0][0] = makeTile(1, true, false);
        layer.data[1][1] = makeTile(5, true, false);
        layer.data[2][2] = makeTile(9, true, false);

        var result = FilterTiles(function (tile) { return tile.index > 3; }, null, 0, 0, 3, 3, { isColliding: true }, layer);

        expect(result.length).toBe(2);
        expect(result[0].index).toBe(5);
        expect(result[1].index).toBe(9);
    });

    it('should return an array (not mutate the layer data)', function ()
    {
        var originalTile = layer.data[0][0];

        var result = FilterTiles(function () { return true; }, null, 0, 0, 3, 3, {}, layer);

        expect(layer.data[0][0]).toBe(originalTile);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle zero width or height returning no tiles', function ()
    {
        var result = FilterTiles(function () { return true; }, null, 0, 0, 0, 3, {}, layer);

        expect(result.length).toBe(0);
    });

    it('should handle tileX out of bounds returning no tiles', function ()
    {
        var result = FilterTiles(function () { return true; }, null, 10, 0, 3, 3, {}, layer);

        expect(result.length).toBe(0);
    });

    it('should clamp negative tileX to zero', function ()
    {
        var result = FilterTiles(function () { return true; }, null, -1, 0, 3, 3, {}, layer);

        expect(result.length).toBe(6);
    });

    it('should pass each tile as the first argument to the callback', function ()
    {
        var passedTiles = [];

        FilterTiles(function (tile)
        {
            passedTiles.push(tile);
            return true;
        }, null, 0, 0, 3, 1, {}, layer);

        expect(passedTiles.length).toBe(3);
        expect(passedTiles[0]).toBe(layer.data[0][0]);
        expect(passedTiles[1]).toBe(layer.data[0][1]);
        expect(passedTiles[2]).toBe(layer.data[0][2]);
    });
});
