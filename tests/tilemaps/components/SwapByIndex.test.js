var SwapByIndex = require('../../../src/tilemaps/components/SwapByIndex');

function createTile (index)
{
    return { index: index };
}

function createLayer (tiles2d)
{
    return {
        width: tiles2d[0].length,
        height: tiles2d.length,
        data: tiles2d
    };
}

describe('Phaser.Tilemaps.Components.SwapByIndex', function ()
{
    it('should swap tiles matching indexA to indexB', function ()
    {
        var layer = createLayer([
            [ createTile(1), createTile(1), createTile(3) ]
        ]);

        SwapByIndex(1, 2, 0, 0, 3, 1, layer);

        expect(layer.data[0][0].index).toBe(2);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[0][2].index).toBe(3);
    });

    it('should swap tiles matching indexB to indexA', function ()
    {
        var layer = createLayer([
            [ createTile(2), createTile(2), createTile(3) ]
        ]);

        SwapByIndex(1, 2, 0, 0, 3, 1, layer);

        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(1);
        expect(layer.data[0][2].index).toBe(3);
    });

    it('should swap both indexA and indexB tiles simultaneously', function ()
    {
        var layer = createLayer([
            [ createTile(1), createTile(2), createTile(1), createTile(2) ]
        ]);

        SwapByIndex(1, 2, 0, 0, 4, 1, layer);

        expect(layer.data[0][0].index).toBe(2);
        expect(layer.data[0][1].index).toBe(1);
        expect(layer.data[0][2].index).toBe(2);
        expect(layer.data[0][3].index).toBe(1);
    });

    it('should not modify tiles that match neither indexA nor indexB', function ()
    {
        var layer = createLayer([
            [ createTile(5), createTile(6), createTile(7) ]
        ]);

        SwapByIndex(1, 2, 0, 0, 3, 1, layer);

        expect(layer.data[0][0].index).toBe(5);
        expect(layer.data[0][1].index).toBe(6);
        expect(layer.data[0][2].index).toBe(7);
    });

    it('should only swap tiles within the specified rectangular region', function ()
    {
        var layer = createLayer([
            [ createTile(1), createTile(1), createTile(1) ],
            [ createTile(1), createTile(1), createTile(1) ],
            [ createTile(1), createTile(1), createTile(1) ]
        ]);

        SwapByIndex(1, 99, 1, 1, 1, 1, layer);

        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(1);
        expect(layer.data[0][2].index).toBe(1);
        expect(layer.data[1][0].index).toBe(1);
        expect(layer.data[1][1].index).toBe(99);
        expect(layer.data[1][2].index).toBe(1);
        expect(layer.data[2][0].index).toBe(1);
        expect(layer.data[2][1].index).toBe(1);
        expect(layer.data[2][2].index).toBe(1);
    });

    it('should work across multiple rows', function ()
    {
        var layer = createLayer([
            [ createTile(1), createTile(2) ],
            [ createTile(2), createTile(1) ],
            [ createTile(1), createTile(1) ]
        ]);

        SwapByIndex(1, 2, 0, 0, 2, 3, layer);

        expect(layer.data[0][0].index).toBe(2);
        expect(layer.data[0][1].index).toBe(1);
        expect(layer.data[1][0].index).toBe(1);
        expect(layer.data[1][1].index).toBe(2);
        expect(layer.data[2][0].index).toBe(2);
        expect(layer.data[2][1].index).toBe(2);
    });

    it('should handle null tile entries without throwing', function ()
    {
        var layer = createLayer([
            [ createTile(1), null, createTile(2) ]
        ]);

        expect(function ()
        {
            SwapByIndex(1, 2, 0, 0, 3, 1, layer);
        }).not.toThrow();

        expect(layer.data[0][0].index).toBe(2);
        expect(layer.data[0][2].index).toBe(1);
    });

    it('should work when indexA equals indexB', function ()
    {
        var layer = createLayer([
            [ createTile(5), createTile(5) ]
        ]);

        SwapByIndex(5, 5, 0, 0, 2, 1, layer);

        expect(layer.data[0][0].index).toBe(5);
        expect(layer.data[0][1].index).toBe(5);
    });

    it('should work with index value of zero', function ()
    {
        var layer = createLayer([
            [ createTile(0), createTile(1) ]
        ]);

        SwapByIndex(0, 1, 0, 0, 2, 1, layer);

        expect(layer.data[0][0].index).toBe(1);
        expect(layer.data[0][1].index).toBe(0);
    });

    it('should work with negative index values', function ()
    {
        var layer = createLayer([
            [ createTile(-1), createTile(2) ]
        ]);

        SwapByIndex(-1, 2, 0, 0, 2, 1, layer);

        expect(layer.data[0][0].index).toBe(2);
        expect(layer.data[0][1].index).toBe(-1);
    });

    it('should handle a single tile matching indexA', function ()
    {
        var layer = createLayer([
            [ createTile(7) ]
        ]);

        SwapByIndex(7, 99, 0, 0, 1, 1, layer);

        expect(layer.data[0][0].index).toBe(99);
    });

    it('should handle a single tile matching indexB', function ()
    {
        var layer = createLayer([
            [ createTile(99) ]
        ]);

        SwapByIndex(7, 99, 0, 0, 1, 1, layer);

        expect(layer.data[0][0].index).toBe(7);
    });

    it('should handle a layer where no tiles match either index', function ()
    {
        var layer = createLayer([
            [ createTile(10), createTile(20), createTile(30) ]
        ]);

        SwapByIndex(1, 2, 0, 0, 3, 1, layer);

        expect(layer.data[0][0].index).toBe(10);
        expect(layer.data[0][1].index).toBe(20);
        expect(layer.data[0][2].index).toBe(30);
    });

    it('should correctly handle a region that clips to the layer boundary', function ()
    {
        var layer = createLayer([
            [ createTile(1), createTile(1) ],
            [ createTile(1), createTile(1) ]
        ]);

        SwapByIndex(1, 2, 0, 0, 10, 10, layer);

        expect(layer.data[0][0].index).toBe(2);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[1][0].index).toBe(2);
        expect(layer.data[1][1].index).toBe(2);
    });

    it('should work with large tile index values', function ()
    {
        var layer = createLayer([
            [ createTile(9999), createTile(8888) ]
        ]);

        SwapByIndex(9999, 8888, 0, 0, 2, 1, layer);

        expect(layer.data[0][0].index).toBe(8888);
        expect(layer.data[0][1].index).toBe(9999);
    });
});
