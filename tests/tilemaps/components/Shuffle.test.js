var Shuffle = require('../../../src/tilemaps/components/Shuffle');

function createLayer (tileIndexes)
{
    var height = tileIndexes.length;
    var width = (height > 0) ? tileIndexes[0].length : 0;

    var data = tileIndexes.map(function (row)
    {
        return row.map(function (idx)
        {
            return { index: idx };
        });
    });

    return { width: width, height: height, data: data };
}

function getAllIndexes (layer)
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

describe('Phaser.Tilemaps.Components.Shuffle', function ()
{
    it('should preserve all tile indexes after shuffling', function ()
    {
        var layer = createLayer([
            [1, 2],
            [3, 4]
        ]);

        Shuffle(0, 0, 2, 2, layer);

        var result = getAllIndexes(layer).sort(function (a, b) { return a - b; });

        expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should preserve duplicate indexes after shuffling', function ()
    {
        var layer = createLayer([
            [5, 5, 10],
            [10, 15, 5]
        ]);

        Shuffle(0, 0, 3, 2, layer);

        var result = getAllIndexes(layer).sort(function (a, b) { return a - b; });

        expect(result).toEqual([5, 5, 5, 10, 10, 15]);
    });

    it('should not change tile indexes when only one tile is in the region', function ()
    {
        var layer = createLayer([[7]]);

        Shuffle(0, 0, 1, 1, layer);

        expect(layer.data[0][0].index).toBe(7);
    });

    it('should not modify tiles when the region is empty', function ()
    {
        var layer = createLayer([
            [1, 2],
            [3, 4]
        ]);

        Shuffle(0, 0, 0, 0, layer);

        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[1][0].index).toBe(3);
        expect(layer.data[1][1].index).toBe(4);
    });

    it('should only shuffle tiles within the specified sub-region', function ()
    {
        var layer = createLayer([
            [1,  2,  3,  4],
            [5,  6,  7,  8],
            [9,  10, 11, 12],
            [13, 14, 15, 16]
        ]);

        // Shuffle only the 2x2 region at (1,1)
        Shuffle(1, 1, 2, 2, layer);

        // Tiles outside the 2x2 region at (1,1)-(2,2) should be untouched
        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[0][2].index).toBe(3);
        expect(layer.data[0][3].index).toBe(4);
        expect(layer.data[1][0].index).toBe(5);
        expect(layer.data[1][3].index).toBe(8);
        expect(layer.data[2][0].index).toBe(9);
        expect(layer.data[2][3].index).toBe(12);
        expect(layer.data[3][0].index).toBe(13);
        expect(layer.data[3][1].index).toBe(14);
        expect(layer.data[3][2].index).toBe(15);
        expect(layer.data[3][3].index).toBe(16);

        // The 4 shuffled tiles should still contain the original 4 values
        var shuffled = [
            layer.data[1][1].index,
            layer.data[1][2].index,
            layer.data[2][1].index,
            layer.data[2][2].index
        ].sort(function (a, b) { return a - b; });

        expect(shuffled).toEqual([6, 7, 10, 11]);
    });

    it('should leave tiles unchanged when all indexes are the same', function ()
    {
        var layer = createLayer([
            [3, 3],
            [3, 3]
        ]);

        Shuffle(0, 0, 2, 2, layer);

        var result = getAllIndexes(layer);

        expect(result).toEqual([3, 3, 3, 3]);
    });

    it('should handle negative tile indexes', function ()
    {
        var layer = createLayer([
            [-1, -1],
            [2,  3]
        ]);

        Shuffle(0, 0, 2, 2, layer);

        var result = getAllIndexes(layer).sort(function (a, b) { return a - b; });

        expect(result).toEqual([-1, -1, 2, 3]);
    });

    it('should eventually produce a different ordering with multiple distinct tiles', function ()
    {
        var seenDifferentOrder = false;

        for (var attempt = 0; attempt < 100; attempt++)
        {
            var layer = createLayer([
                [1, 2, 3, 4],
                [5, 6, 7, 8]
            ]);

            Shuffle(0, 0, 4, 2, layer);

            var result = getAllIndexes(layer);
            var original = [1, 2, 3, 4, 5, 6, 7, 8];
            var same = true;

            for (var i = 0; i < original.length; i++)
            {
                if (result[i] !== original[i])
                {
                    same = false;
                    break;
                }
            }

            if (!same)
            {
                seenDifferentOrder = true;
                break;
            }
        }

        expect(seenDifferentOrder).toBe(true);
    });

    it('should only modify index properties and not other tile properties', function ()
    {
        var layer = {
            width: 2,
            height: 1,
            data: [
                [
                    { index: 1, x: 0, y: 0, collides: false },
                    { index: 2, x: 1, y: 0, collides: true  }
                ]
            ]
        };

        Shuffle(0, 0, 2, 1, layer);

        expect(layer.data[0][0].x).toBe(0);
        expect(layer.data[0][0].y).toBe(0);
        expect(layer.data[0][0].collides).toBe(false);
        expect(layer.data[0][1].x).toBe(1);
        expect(layer.data[0][1].y).toBe(0);
        expect(layer.data[0][1].collides).toBe(true);
    });

    it('should clip the region to the layer boundaries without throwing', function ()
    {
        var layer = createLayer([
            [1, 2],
            [3, 4]
        ]);

        // Region extends beyond layer bounds — should not throw
        expect(function ()
        {
            Shuffle(-1, -1, 10, 10, layer);
        }).not.toThrow();

        // All original indexes should still be present
        var result = getAllIndexes(layer).sort(function (a, b) { return a - b; });

        expect(result).toEqual([1, 2, 3, 4]);
    });
});
