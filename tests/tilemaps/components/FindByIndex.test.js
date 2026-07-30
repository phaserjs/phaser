var FindByIndex = require('../../../src/tilemaps/components/FindByIndex');

describe('Phaser.Tilemaps.Components.FindByIndex', function ()
{
    function makeTile(index)
    {
        return { index: index };
    }

    function makeLayer(data)
    {
        return {
            data: data,
            width: data[0].length,
            height: data.length
        };
    }

    it('should return null when no tile matches the given index', function ()
    {
        var layer = makeLayer([
            [ makeTile(1), makeTile(2) ],
            [ makeTile(3), makeTile(4) ]
        ]);

        expect(FindByIndex(99, 0, false, layer)).toBeNull();
    });

    it('should return the first matching tile scanning top-left to bottom-right', function ()
    {
        var tile = makeTile(5);
        var layer = makeLayer([
            [ makeTile(1), makeTile(2) ],
            [ tile,        makeTile(5) ]
        ]);

        expect(FindByIndex(5, 0, false, layer)).toBe(tile);
    });

    it('should return the first matching tile scanning bottom-right to top-left when reverse is true', function ()
    {
        var first = makeTile(5);
        var last = makeTile(5);
        var layer = makeLayer([
            [ makeTile(1), first ],
            [ makeTile(3), last  ]
        ]);

        expect(FindByIndex(5, 0, true, layer)).toBe(last);
    });

    it('should skip the specified number of matching tiles before returning', function ()
    {
        var tile1 = makeTile(7);
        var tile2 = makeTile(7);
        var tile3 = makeTile(7);
        var layer = makeLayer([
            [ tile1, makeTile(1) ],
            [ tile2, makeTile(1) ],
            [ tile3, makeTile(1) ]
        ]);

        expect(FindByIndex(7, 1, false, layer)).toBe(tile2);
        expect(FindByIndex(7, 2, false, layer)).toBe(tile3);
    });

    it('should skip the specified number of matching tiles when scanning in reverse', function ()
    {
        var tile1 = makeTile(7);
        var tile2 = makeTile(7);
        var tile3 = makeTile(7);
        var layer = makeLayer([
            [ tile1, makeTile(1) ],
            [ tile2, makeTile(1) ],
            [ tile3, makeTile(1) ]
        ]);

        expect(FindByIndex(7, 1, true, layer)).toBe(tile2);
        expect(FindByIndex(7, 2, true, layer)).toBe(tile1);
    });

    it('should return null when skip exceeds the number of matching tiles', function ()
    {
        var layer = makeLayer([
            [ makeTile(3), makeTile(1) ],
            [ makeTile(3), makeTile(1) ]
        ]);

        expect(FindByIndex(3, 5, false, layer)).toBeNull();
    });

    it('should default skip to 0 when not provided', function ()
    {
        var tile = makeTile(2);
        var layer = makeLayer([
            [ tile, makeTile(1) ]
        ]);

        expect(FindByIndex(2, undefined, false, layer)).toBe(tile);
    });

    it('should default reverse to false when not provided', function ()
    {
        var first = makeTile(2);
        var second = makeTile(2);
        var layer = makeLayer([
            [ first,  makeTile(1) ],
            [ second, makeTile(1) ]
        ]);

        expect(FindByIndex(2, 0, undefined, layer)).toBe(first);
    });

    it('should skip null tiles in the layer data', function ()
    {
        var tile = makeTile(4);
        var layer = makeLayer([
            [ null, null ],
            [ null, tile ]
        ]);

        expect(FindByIndex(4, 0, false, layer)).toBe(tile);
    });

    it('should return null on an empty layer', function ()
    {
        var layer = makeLayer([
            [ makeTile(1) ]
        ]);

        expect(FindByIndex(99, 0, false, layer)).toBeNull();
    });

    it('should return null on a layer filled with nulls', function ()
    {
        var layer = makeLayer([
            [ null, null ],
            [ null, null ]
        ]);

        expect(FindByIndex(1, 0, false, layer)).toBeNull();
    });

    it('should find a tile with index 0', function ()
    {
        var tile = makeTile(0);
        var layer = makeLayer([
            [ makeTile(1), tile ]
        ]);

        expect(FindByIndex(0, 0, false, layer)).toBe(tile);
    });

    it('should find a tile with a negative index', function ()
    {
        var tile = makeTile(-1);
        var layer = makeLayer([
            [ makeTile(1), tile ]
        ]);

        expect(FindByIndex(-1, 0, false, layer)).toBe(tile);
    });

    it('should scan row by row left-to-right top-to-bottom when not reversed', function ()
    {
        var rowOne = makeTile(9);
        var rowTwo = makeTile(9);
        var layer = makeLayer([
            [ makeTile(1), rowOne ],
            [ rowTwo,      makeTile(1) ]
        ]);

        expect(FindByIndex(9, 0, false, layer)).toBe(rowOne);
    });

    it('should scan row by row right-to-left bottom-to-top when reversed', function ()
    {
        var topLeft = makeTile(9);
        var bottomRight = makeTile(9);
        var layer = makeLayer([
            [ topLeft,     makeTile(1) ],
            [ makeTile(1), bottomRight ]
        ]);

        expect(FindByIndex(9, 0, true, layer)).toBe(bottomRight);
    });

    it('should return the only tile when layer has a single cell matching', function ()
    {
        var tile = makeTile(42);
        var layer = makeLayer([
            [ tile ]
        ]);

        expect(FindByIndex(42, 0, false, layer)).toBe(tile);
        expect(FindByIndex(42, 0, true, layer)).toBe(tile);
    });
});
