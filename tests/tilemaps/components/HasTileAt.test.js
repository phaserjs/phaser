var HasTileAt = require('../../../src/tilemaps/components/HasTileAt');

describe('Phaser.Tilemaps.Components.HasTileAt', function ()
{
    var layer;

    function makeTile (index)
    {
        return { index: index };
    }

    beforeEach(function ()
    {
        layer = {
            width: 3,
            height: 3,
            data: [
                [ makeTile(1),  makeTile(2),  makeTile(3)  ],
                [ makeTile(4),  makeTile(-1), makeTile(6)  ],
                [ makeTile(7),  null,          makeTile(9)  ]
            ]
        };
    });

    it('should return true when a valid tile exists at the given coordinates', function ()
    {
        expect(HasTileAt(0, 0, layer)).toBe(true);
    });

    it('should return true for a tile with index greater than -1', function ()
    {
        expect(HasTileAt(2, 2, layer)).toBe(true);
    });

    it('should return false when the tile index is -1', function ()
    {
        expect(HasTileAt(1, 1, layer)).toBe(false);
    });

    it('should return false when the tile is null', function ()
    {
        expect(HasTileAt(1, 2, layer)).toBe(false);
    });

    it('should return false when tileX is negative', function ()
    {
        expect(HasTileAt(-1, 0, layer)).toBe(false);
    });

    it('should return false when tileY is negative', function ()
    {
        expect(HasTileAt(0, -1, layer)).toBe(false);
    });

    it('should return false when tileX equals layer width', function ()
    {
        expect(HasTileAt(3, 0, layer)).toBe(false);
    });

    it('should return false when tileY equals layer height', function ()
    {
        expect(HasTileAt(0, 3, layer)).toBe(false);
    });

    it('should return false when tileX is greater than layer width', function ()
    {
        expect(HasTileAt(10, 0, layer)).toBe(false);
    });

    it('should return false when tileY is greater than layer height', function ()
    {
        expect(HasTileAt(0, 10, layer)).toBe(false);
    });

    it('should return true for tile at boundary position (last valid coordinate)', function ()
    {
        expect(HasTileAt(2, 0, layer)).toBe(true);
        expect(HasTileAt(0, 2, layer)).toBe(true);
    });

    it('should return true for all valid non-null tiles with positive index', function ()
    {
        expect(HasTileAt(0, 0, layer)).toBe(true);
        expect(HasTileAt(1, 0, layer)).toBe(true);
        expect(HasTileAt(2, 0, layer)).toBe(true);
        expect(HasTileAt(0, 1, layer)).toBe(true);
        expect(HasTileAt(2, 1, layer)).toBe(true);
        expect(HasTileAt(0, 2, layer)).toBe(true);
        expect(HasTileAt(2, 2, layer)).toBe(true);
    });

    it('should handle a layer with a single cell containing a valid tile', function ()
    {
        var singleLayer = {
            width: 1,
            height: 1,
            data: [ [ makeTile(5) ] ]
        };

        expect(HasTileAt(0, 0, singleLayer)).toBe(true);
    });

    it('should handle a layer with a single cell containing a tile with index -1', function ()
    {
        var singleLayer = {
            width: 1,
            height: 1,
            data: [ [ makeTile(-1) ] ]
        };

        expect(HasTileAt(0, 0, singleLayer)).toBe(false);
    });

    it('should handle a layer with a single cell containing null', function ()
    {
        var singleLayer = {
            width: 1,
            height: 1,
            data: [ [ null ] ]
        };

        expect(HasTileAt(0, 0, singleLayer)).toBe(false);
    });
});
