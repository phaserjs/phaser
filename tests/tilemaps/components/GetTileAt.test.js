var GetTileAt = require('../../../src/tilemaps/components/GetTileAt');

describe('Phaser.Tilemaps.Components.GetTileAt', function ()
{
    var layer;
    var tileWithIndex;
    var emptyTile;

    beforeEach(function ()
    {
        tileWithIndex = { index: 5 };
        emptyTile = { index: -1 };

        layer = {
            width: 4,
            height: 4,
            data: [
                [ tileWithIndex, tileWithIndex, tileWithIndex, tileWithIndex ],
                [ tileWithIndex, emptyTile,     null,          tileWithIndex ],
                [ tileWithIndex, tileWithIndex, tileWithIndex, tileWithIndex ],
                [ tileWithIndex, tileWithIndex, tileWithIndex, tileWithIndex ]
            ]
        };
    });

    it('should return the tile at the given coordinates', function ()
    {
        var result = GetTileAt(0, 0, false, layer);
        expect(result).toBe(tileWithIndex);
    });

    it('should return null when tileX is out of bounds (negative)', function ()
    {
        var result = GetTileAt(-1, 0, false, layer);
        expect(result).toBeNull();
    });

    it('should return null when tileX is out of bounds (too large)', function ()
    {
        var result = GetTileAt(4, 0, false, layer);
        expect(result).toBeNull();
    });

    it('should return null when tileY is out of bounds (negative)', function ()
    {
        var result = GetTileAt(0, -1, false, layer);
        expect(result).toBeNull();
    });

    it('should return null when tileY is out of bounds (too large)', function ()
    {
        var result = GetTileAt(0, 4, false, layer);
        expect(result).toBeNull();
    });

    it('should return null when the cell is null and nonNull is false', function ()
    {
        var result = GetTileAt(2, 1, false, layer);
        expect(result).toBeNull();
    });

    it('should return null when the cell is null and nonNull is true', function ()
    {
        var result = GetTileAt(2, 1, true, layer);
        expect(result).toBeNull();
    });

    it('should return null for an empty tile (index -1) when nonNull is false', function ()
    {
        var result = GetTileAt(1, 1, false, layer);
        expect(result).toBeNull();
    });

    it('should return the empty tile (index -1) when nonNull is true', function ()
    {
        var result = GetTileAt(1, 1, true, layer);
        expect(result).toBe(emptyTile);
    });

    it('should return a real tile regardless of the nonNull flag', function ()
    {
        expect(GetTileAt(0, 0, false, layer)).toBe(tileWithIndex);
        expect(GetTileAt(0, 0, true, layer)).toBe(tileWithIndex);
    });

    it('should return null when coordinates are exactly on the layer boundary (width)', function ()
    {
        var result = GetTileAt(layer.width, 0, false, layer);
        expect(result).toBeNull();
    });

    it('should return null when coordinates are exactly on the layer boundary (height)', function ()
    {
        var result = GetTileAt(0, layer.height, false, layer);
        expect(result).toBeNull();
    });

    it('should return tile at the last valid coordinate', function ()
    {
        var result = GetTileAt(layer.width - 1, layer.height - 1, false, layer);
        expect(result).toBe(tileWithIndex);
    });

    it('should return null when both coordinates are out of bounds', function ()
    {
        var result = GetTileAt(-5, -5, true, layer);
        expect(result).toBeNull();
    });

    it('should handle a layer with a single cell containing a valid tile', function ()
    {
        var singleLayer = {
            width: 1,
            height: 1,
            data: [ [ { index: 3 } ] ]
        };

        var result = GetTileAt(0, 0, false, singleLayer);
        expect(result).toBe(singleLayer.data[0][0]);
    });

    it('should handle a layer with a single empty cell when nonNull is true', function ()
    {
        var emptyCell = { index: -1 };
        var singleLayer = {
            width: 1,
            height: 1,
            data: [ [ emptyCell ] ]
        };

        var result = GetTileAt(0, 0, true, singleLayer);
        expect(result).toBe(emptyCell);
    });

    it('should handle a layer with a single empty cell when nonNull is false', function ()
    {
        var singleLayer = {
            width: 1,
            height: 1,
            data: [ [ { index: -1 } ] ]
        };

        var result = GetTileAt(0, 0, false, singleLayer);
        expect(result).toBeNull();
    });

    it('should return null for a 0x0 layer', function ()
    {
        var emptyLayer = {
            width: 0,
            height: 0,
            data: []
        };

        var result = GetTileAt(0, 0, false, emptyLayer);
        expect(result).toBeNull();
    });
});
