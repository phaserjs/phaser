var Randomize = require('../../../src/tilemaps/components/Randomize');

function makeTile(index)
{
    return { index: index, collides: false, hasInterestingFace: false };
}

function makeLayer(tileIndexes2D)
{
    var height = tileIndexes2D.length;
    var width = height > 0 ? tileIndexes2D[0].length : 0;
    var data = [];

    for (var y = 0; y < height; y++)
    {
        data[y] = [];

        for (var x = 0; x < width; x++)
        {
            data[y][x] = makeTile(tileIndexes2D[y][x]);
        }
    }

    return { data: data, width: width, height: height };
}

function getAllTileIndexes(layer)
{
    var indexes = [];

    for (var y = 0; y < layer.data.length; y++)
    {
        for (var x = 0; x < layer.data[y].length; x++)
        {
            indexes.push(layer.data[y][x].index);
        }
    }

    return indexes;
}

describe('Phaser.Tilemaps.Components.Randomize', function ()
{
    it('should assign each tile an index from the provided indexes array', function ()
    {
        var layer = makeLayer([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        var indexes = [10, 20, 30];

        Randomize(0, 0, 3, 3, indexes, layer);

        var result = getAllTileIndexes(layer);

        for (var i = 0; i < result.length; i++)
        {
            expect(indexes).toContain(result[i]);
        }
    });

    it('should assign all tiles new indexes when given a single-value array', function ()
    {
        var layer = makeLayer([
            [1, 2],
            [3, 4]
        ]);

        Randomize(0, 0, 2, 2, [99], layer);

        var result = getAllTileIndexes(layer);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i]).toBe(99);
        }
    });

    it('should collect unique indexes from tiles when no indexes array is provided', function ()
    {
        var layer = makeLayer([
            [1, 2, 3],
            [1, 2, 3]
        ]);

        Randomize(0, 0, 3, 2, null, layer);

        var result = getAllTileIndexes(layer);

        for (var i = 0; i < result.length; i++)
        {
            expect([1, 2, 3]).toContain(result[i]);
        }
    });

    it('should only randomize tiles within the specified region', function ()
    {
        var layer = makeLayer([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        Randomize(1, 1, 1, 1, [99], layer);

        // Tiles outside the 1x1 region at (1,1) should be unchanged
        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[0][2].index).toBe(3);
        expect(layer.data[1][0].index).toBe(4);
        expect(layer.data[1][2].index).toBe(6);
        expect(layer.data[2][0].index).toBe(7);
        expect(layer.data[2][1].index).toBe(8);
        expect(layer.data[2][2].index).toBe(9);

        // The tile at (1,1) should be 99
        expect(layer.data[1][1].index).toBe(99);
    });

    it('should only randomize tiles within a sub-region of the layer', function ()
    {
        var layer = makeLayer([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]);

        Randomize(1, 1, 2, 2, [5, 6, 7], layer);

        // Corner tiles outside the 2x2 sub-region should remain 0
        expect(layer.data[0][0].index).toBe(0);
        expect(layer.data[0][3].index).toBe(0);
        expect(layer.data[3][0].index).toBe(0);
        expect(layer.data[3][3].index).toBe(0);

        // Tiles inside the 2x2 sub-region should be from [5, 6, 7]
        expect([5, 6, 7]).toContain(layer.data[1][1].index);
        expect([5, 6, 7]).toContain(layer.data[1][2].index);
        expect([5, 6, 7]).toContain(layer.data[2][1].index);
        expect([5, 6, 7]).toContain(layer.data[2][2].index);
    });

    it('should produce varying indexes across many iterations when given multiple options', function ()
    {
        var layer = makeLayer([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]);

        var indexes = [1, 2, 3, 4, 5];
        var seen = {};

        for (var iter = 0; iter < 50; iter++)
        {
            Randomize(0, 0, 5, 5, indexes, layer);

            for (var y = 0; y < 5; y++)
            {
                for (var x = 0; x < 5; x++)
                {
                    seen[layer.data[y][x].index] = true;
                }
            }
        }

        // After many iterations across a 5x5 grid, all 5 values should appear
        expect(Object.keys(seen).length).toBe(5);
    });

    it('should use unique indexes from the region when no indexes are passed and tiles have repeats', function ()
    {
        var layer = makeLayer([
            [3, 3, 3],
            [3, 3, 3]
        ]);

        Randomize(0, 0, 3, 2, null, layer);

        var result = getAllTileIndexes(layer);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i]).toBe(3);
        }
    });

    it('should handle a single tile layer', function ()
    {
        var layer = makeLayer([
            [42]
        ]);

        Randomize(0, 0, 1, 1, [7, 8, 9], layer);

        expect([7, 8, 9]).toContain(layer.data[0][0].index);
    });

    it('should handle a single tile with no indexes provided', function ()
    {
        var layer = makeLayer([
            [42]
        ]);

        Randomize(0, 0, 1, 1, null, layer);

        // Only index available is 42, so result must be 42
        expect(layer.data[0][0].index).toBe(42);
    });

    it('should not modify tiles outside the layer bounds when coordinates are at the edge', function ()
    {
        var layer = makeLayer([
            [1, 2],
            [3, 4]
        ]);

        // Width/height larger than layer — should clip to layer bounds
        Randomize(0, 0, 100, 100, [99], layer);

        var result = getAllTileIndexes(layer);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i]).toBe(99);
        }
    });

    it('should keep all resulting indexes within the provided indexes range over many calls', function ()
    {
        var layer = makeLayer([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]);

        var indexes = [100, 200, 300];

        for (var iter = 0; iter < 100; iter++)
        {
            Randomize(0, 0, 3, 3, indexes, layer);

            for (var y = 0; y < 3; y++)
            {
                for (var x = 0; x < 3; x++)
                {
                    expect(indexes).toContain(layer.data[y][x].index);
                }
            }
        }
    });
});
