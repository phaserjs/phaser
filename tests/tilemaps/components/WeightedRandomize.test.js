var MATH = require('../../../src/math');
var WeightedRandomize = require('../../../src/tilemaps/components/WeightedRandomize');

function makeTile (index)
{
    return { index: index, collides: false, hasInterestingFace: false };
}

function makeLayer (tileData)
{
    var height = tileData.length;
    var width = height > 0 ? tileData[0].length : 0;
    var data = [];

    for (var y = 0; y < height; y++)
    {
        data[y] = [];

        for (var x = 0; x < width; x++)
        {
            data[y][x] = makeTile(tileData[y][x]);
        }
    }

    return { data: data, width: width, height: height };
}

describe('Phaser.Tilemaps.Components.WeightedRandomize', function ()
{
    var fracMock;
    var originalRND;

    beforeEach(function ()
    {
        originalRND = MATH.RND;
        fracMock = vi.fn().mockReturnValue(0.5);
        MATH.RND = { frac: fracMock };
    });

    afterEach(function ()
    {
        MATH.RND = originalRND;
    });

    it('should do nothing if weightedIndexes is null', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);

        WeightedRandomize(0, 0, 1, 1, null, layer);

        expect(fracMock).not.toHaveBeenCalled();
    });

    it('should do nothing if weightedIndexes is undefined', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);

        WeightedRandomize(0, 0, 1, 1, undefined, layer);

        expect(fracMock).not.toHaveBeenCalled();
    });

    it('should do nothing if weightTotal is zero', function ()
    {
        var layer = makeLayer([ [ 0, 0, 0 ] ]);
        var weightedIndexes = [
            { index: 1, weight: 0 },
            { index: 2, weight: 0 }
        ];

        WeightedRandomize(0, 0, 3, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(0);
        expect(layer.data[0][1].index).toBe(0);
        expect(layer.data[0][2].index).toBe(0);
    });

    it('should do nothing if weightTotal is negative', function ()
    {
        var layer = makeLayer([ [ 0, 0, 0 ] ]);
        var weightedIndexes = [
            { index: 1, weight: -1 },
            { index: 2, weight: -1 }
        ];

        WeightedRandomize(0, 0, 3, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(0);
        expect(layer.data[0][1].index).toBe(0);
        expect(layer.data[0][2].index).toBe(0);
    });

    it('should only process tiles within the specified region', function ()
    {
        var layer = makeLayer([
            [ 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0 ]
        ]);
        var weightedIndexes = [ { index: 5, weight: 1 } ];

        fracMock.mockReturnValue(0);

        // Process only a 1x1 area at (2, 3)
        WeightedRandomize(2, 3, 1, 1, weightedIndexes, layer);

        // Tile at (2, 3) should be modified
        expect(layer.data[3][2].index).toBe(5);

        // Tiles outside the region should be unchanged
        expect(layer.data[0][0].index).toBe(0);
        expect(layer.data[4][4].index).toBe(0);
        expect(layer.data[3][1].index).toBe(0);
        expect(layer.data[3][3].index).toBe(0);
    });

    it('should assign the correct index when there is only one weighted option', function ()
    {
        var layer = makeLayer([ [ 0, 0, 0 ] ]);
        var weightedIndexes = [ { index: 7, weight: 1 } ];

        // rand = 0 * 1 = 0, sum = 1, 0 <= 1 -> picks index 7
        fracMock.mockReturnValue(0);

        WeightedRandomize(0, 0, 3, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(7);
        expect(layer.data[0][1].index).toBe(7);
        expect(layer.data[0][2].index).toBe(7);
    });

    it('should pick the first index when rand is exactly at the first weight boundary', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [
            { index: 1, weight: 2 },
            { index: 2, weight: 2 }
        ];

        // weightTotal = 4, frac = 0.5 -> rand = 2.0
        // j=0: sum = 2, 2.0 <= 2 -> picks index 1
        fracMock.mockReturnValue(0.5);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(1);
    });

    it('should pick the second index when rand exceeds the first weight', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [
            { index: 1, weight: 2 },
            { index: 2, weight: 2 }
        ];

        // weightTotal = 4, frac = 0.6 -> rand = 2.4
        // j=0: sum = 2, 2.4 <= 2? No
        // j=1: sum = 4, 2.4 <= 4 -> picks index 2
        fracMock.mockReturnValue(0.6);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(2);
    });

    it('should pick the last index when rand is near the total weight', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [
            { index: 6, weight: 4 },
            { index: 7, weight: 2 },
            { index: 8, weight: 1.5 },
            { index: 26, weight: 0.5 }
        ];

        // weightTotal = 8, frac = 0.95 -> rand = 7.6
        // j=0: sum = 4,   7.6 <= 4?   No
        // j=1: sum = 6,   7.6 <= 6?   No
        // j=2: sum = 7.5, 7.6 <= 7.5? No
        // j=3: sum = 8.0, 7.6 <= 8.0  -> picks index 26
        fracMock.mockReturnValue(0.95);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(26);
    });

    it('should pick the first index when rand is near zero', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [
            { index: 6, weight: 4 },
            { index: 7, weight: 2 },
            { index: 8, weight: 1.5 },
            { index: 26, weight: 0.5 }
        ];

        // weightTotal = 8, frac = 0.01 -> rand = 0.08
        // j=0: sum = 4, 0.08 <= 4 -> picks index 6
        fracMock.mockReturnValue(0.01);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(6);
    });

    it('should handle an array index by selecting from it using frac', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [ { index: [ 10, 11, 12 ], weight: 1 } ];

        // First frac: 0 * 1 = 0 -> 0 <= 1 -> chosen = [10, 11, 12]
        // Second frac: 0.5 * 3 = 1.5 -> floor(1.5) = 1 -> array[1] = 11
        fracMock
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.5);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(11);
    });

    it('should handle an array index and pick the first element', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [ { index: [ 10, 11, 12 ], weight: 1 } ];

        // Second frac: 0 * 3 = 0 -> floor(0) = 0 -> array[0] = 10
        fracMock
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(10);
    });

    it('should handle an array index and pick the last element', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [ { index: [ 10, 11, 12 ], weight: 1 } ];

        // Second frac: 0.99 * 3 = 2.97 -> floor(2.97) = 2 -> array[2] = 12
        fracMock
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.99);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(12);
    });

    it('should process multiple tiles independently using separate frac calls', function ()
    {
        var layer = makeLayer([ [ 0, 0 ] ]);
        var weightedIndexes = [
            { index: 1, weight: 1 },
            { index: 2, weight: 1 }
        ];

        // weightTotal = 2
        // Tile 0: frac = 0.3 -> rand = 0.6 -> j=0: sum = 1, 0.6 <= 1 -> index 1
        // Tile 1: frac = 0.8 -> rand = 1.6 -> j=0: sum = 1, 1.6 > 1; j=1: sum = 2, 1.6 <= 2 -> index 2
        fracMock
            .mockReturnValueOnce(0.3)
            .mockReturnValueOnce(0.8);

        WeightedRandomize(0, 0, 2, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(2);
    });

    it('should handle an empty tiles array without throwing', function ()
    {
        var layer = { data: [], width: 0, height: 0 };
        var weightedIndexes = [ { index: 1, weight: 1 } ];

        expect(function () { WeightedRandomize(0, 0, 0, 0, weightedIndexes, layer); }).not.toThrow();
    });

    it('should handle a single tile', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [ { index: 42, weight: 1 } ];

        fracMock.mockReturnValue(0);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(42);
    });

    it('should handle floating point weights correctly', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [
            { index: 6, weight: 4 },
            { index: 7, weight: 2 },
            { index: 8, weight: 1.5 },
            { index: 26, weight: 0.5 }
        ];

        // weightTotal = 8, frac = 0.7 -> rand = 5.6
        // j=0: sum = 4, 5.6 <= 4? No
        // j=1: sum = 6, 5.6 <= 6 -> picks index 7
        fracMock.mockReturnValue(0.7);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(7);
    });

    it('should only modify the index property of tiles and not other properties', function ()
    {
        var tile = { index: 0, x: 5, y: 10, collides: true, hasInterestingFace: false };
        var layer = { data: [ [ tile ] ], width: 1, height: 1 };
        var weightedIndexes = [ { index: 3, weight: 1 } ];

        fracMock.mockReturnValue(0);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(tile.index).toBe(3);
        expect(tile.x).toBe(5);
        expect(tile.y).toBe(10);
        expect(tile.collides).toBe(true);
    });

    it('should handle a single-element array index as equivalent to a scalar', function ()
    {
        var layer = makeLayer([ [ 0 ] ]);
        var weightedIndexes = [ { index: [ 99 ], weight: 1 } ];

        // Second frac: any value * 1 = something, floor -> 0 -> array[0] = 99
        fracMock
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.5);

        WeightedRandomize(0, 0, 1, 1, weightedIndexes, layer);

        expect(layer.data[0][0].index).toBe(99);
    });
});
