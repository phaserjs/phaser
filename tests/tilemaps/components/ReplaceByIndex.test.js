var ReplaceByIndex = require('../../../src/tilemaps/components/ReplaceByIndex');

function makeTile (index)
{
    return { index: index };
}

function makeLayer (tileIndexes2D)
{
    var height = tileIndexes2D.length;
    var width = height > 0 ? tileIndexes2D[0].length : 0;
    var data = [];

    for (var y = 0; y < height; y++)
    {
        data[y] = [];

        for (var x = 0; x < width; x++)
        {
            var val = tileIndexes2D[y][x];

            data[y][x] = (val === null) ? null : makeTile(val);
        }
    }

    return { data: data, width: width, height: height };
}

describe('Phaser.Tilemaps.Components.ReplaceByIndex', function ()
{
    it('should replace all tiles matching findIndex with newIndex', function ()
    {
        var layer = makeLayer([
            [5, 5, 3],
            [1, 5, 2]
        ]);

        ReplaceByIndex(5, 9, 0, 0, 3, 2, layer);

        expect(layer.data[0][0].index).toBe(9);
        expect(layer.data[0][1].index).toBe(9);
        expect(layer.data[0][2].index).toBe(3);
        expect(layer.data[1][0].index).toBe(1);
        expect(layer.data[1][1].index).toBe(9);
        expect(layer.data[1][2].index).toBe(2);
    });

    it('should not modify tiles that do not match findIndex', function ()
    {
        var layer = makeLayer([
            [1, 2, 3]
        ]);

        ReplaceByIndex(7, 10, 0, 0, 3, 1, layer);

        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[0][2].index).toBe(3);
    });

    it('should replace a tile index of 0 correctly', function ()
    {
        var layer = makeLayer([
            [0, 1, 0]
        ]);

        ReplaceByIndex(0, 5, 0, 0, 3, 1, layer);

        expect(layer.data[0][0].index).toBe(5);
        expect(layer.data[0][1].index).toBe(1);
        expect(layer.data[0][2].index).toBe(5);
    });

    it('should replace with a newIndex of 0', function ()
    {
        var layer = makeLayer([
            [3, 3, 1]
        ]);

        ReplaceByIndex(3, 0, 0, 0, 3, 1, layer);

        expect(layer.data[0][0].index).toBe(0);
        expect(layer.data[0][1].index).toBe(0);
        expect(layer.data[0][2].index).toBe(1);
    });

    it('should handle negative tile indices', function ()
    {
        var layer = makeLayer([
            [-1, 2]
        ]);

        ReplaceByIndex(-1, 5, 0, 0, 2, 1, layer);

        expect(layer.data[0][0].index).toBe(5);
        expect(layer.data[0][1].index).toBe(2);
    });

    it('should be a no-op when findIndex equals newIndex', function ()
    {
        var layer = makeLayer([
            [4, 4]
        ]);

        ReplaceByIndex(4, 4, 0, 0, 2, 1, layer);

        expect(layer.data[0][0].index).toBe(4);
        expect(layer.data[0][1].index).toBe(4);
    });

    it('should only affect tiles within the specified rectangular area', function ()
    {
        var layer = makeLayer([
            [5, 5, 5],
            [5, 5, 5],
            [5, 5, 5]
        ]);

        ReplaceByIndex(5, 9, 1, 1, 1, 1, layer);

        expect(layer.data[0][0].index).toBe(5);
        expect(layer.data[0][1].index).toBe(5);
        expect(layer.data[0][2].index).toBe(5);
        expect(layer.data[1][0].index).toBe(5);
        expect(layer.data[1][1].index).toBe(9);
        expect(layer.data[1][2].index).toBe(5);
        expect(layer.data[2][0].index).toBe(5);
        expect(layer.data[2][1].index).toBe(5);
        expect(layer.data[2][2].index).toBe(5);
    });

    it('should skip null tile entries without error', function ()
    {
        var layer = makeLayer([
            [null, 5, null]
        ]);

        expect(function ()
        {
            ReplaceByIndex(5, 9, 0, 0, 3, 1, layer);
        }).not.toThrow();

        expect(layer.data[0][1].index).toBe(9);
    });

    it('should handle a single tile layer', function ()
    {
        var layer = makeLayer([
            [7]
        ]);

        ReplaceByIndex(7, 12, 0, 0, 1, 1, layer);

        expect(layer.data[0][0].index).toBe(12);
    });

    it('should handle when no tiles match findIndex', function ()
    {
        var layer = makeLayer([
            [1, 2, 3]
        ]);

        ReplaceByIndex(99, 0, 0, 0, 3, 1, layer);

        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[0][2].index).toBe(3);
    });

    it('should replace across multiple rows and columns', function ()
    {
        var layer = makeLayer([
            [1, 2, 1],
            [2, 1, 2],
            [1, 2, 1]
        ]);

        ReplaceByIndex(1, 99, 0, 0, 3, 3, layer);

        expect(layer.data[0][0].index).toBe(99);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[0][2].index).toBe(99);
        expect(layer.data[1][0].index).toBe(2);
        expect(layer.data[1][1].index).toBe(99);
        expect(layer.data[1][2].index).toBe(2);
        expect(layer.data[2][0].index).toBe(99);
        expect(layer.data[2][1].index).toBe(2);
        expect(layer.data[2][2].index).toBe(99);
    });

    it('should clip width to layer bounds when exceeding layer width', function ()
    {
        var layer = makeLayer([
            [5, 5, 5]
        ]);

        ReplaceByIndex(5, 9, 0, 0, 100, 1, layer);

        expect(layer.data[0][0].index).toBe(9);
        expect(layer.data[0][1].index).toBe(9);
        expect(layer.data[0][2].index).toBe(9);
    });
});
