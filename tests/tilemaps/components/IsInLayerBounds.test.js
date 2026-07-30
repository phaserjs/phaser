var IsInLayerBounds = require('../../../src/tilemaps/components/IsInLayerBounds');

describe('Phaser.Tilemaps.Components.IsInLayerBounds', function ()
{
    var layer;

    beforeEach(function ()
    {
        layer = { width: 10, height: 8 };
    });

    it('should return true when coordinates are within bounds', function ()
    {
        expect(IsInLayerBounds(0, 0, layer)).toBe(true);
    });

    it('should return true for coordinates at the maximum valid position', function ()
    {
        expect(IsInLayerBounds(9, 7, layer)).toBe(true);
    });

    it('should return true for coordinates in the middle of the layer', function ()
    {
        expect(IsInLayerBounds(5, 4, layer)).toBe(true);
    });

    it('should return false when tileX is negative', function ()
    {
        expect(IsInLayerBounds(-1, 0, layer)).toBe(false);
    });

    it('should return false when tileY is negative', function ()
    {
        expect(IsInLayerBounds(0, -1, layer)).toBe(false);
    });

    it('should return false when both coordinates are negative', function ()
    {
        expect(IsInLayerBounds(-1, -1, layer)).toBe(false);
    });

    it('should return false when tileX equals layer width', function ()
    {
        expect(IsInLayerBounds(10, 0, layer)).toBe(false);
    });

    it('should return false when tileY equals layer height', function ()
    {
        expect(IsInLayerBounds(0, 8, layer)).toBe(false);
    });

    it('should return false when tileX exceeds layer width', function ()
    {
        expect(IsInLayerBounds(15, 0, layer)).toBe(false);
    });

    it('should return false when tileY exceeds layer height', function ()
    {
        expect(IsInLayerBounds(0, 15, layer)).toBe(false);
    });

    it('should return false when both coordinates exceed bounds', function ()
    {
        expect(IsInLayerBounds(10, 8, layer)).toBe(false);
    });

    it('should return true for a 1x1 layer at position 0,0', function ()
    {
        var smallLayer = { width: 1, height: 1 };
        expect(IsInLayerBounds(0, 0, smallLayer)).toBe(true);
    });

    it('should return false for a 1x1 layer at position 1,0', function ()
    {
        var smallLayer = { width: 1, height: 1 };
        expect(IsInLayerBounds(1, 0, smallLayer)).toBe(false);
    });

    it('should return false for a 1x1 layer at position 0,1', function ()
    {
        var smallLayer = { width: 1, height: 1 };
        expect(IsInLayerBounds(0, 1, smallLayer)).toBe(false);
    });

    it('should handle large coordinate values beyond the layer', function ()
    {
        expect(IsInLayerBounds(1000, 1000, layer)).toBe(false);
    });

    it('should handle large negative coordinate values', function ()
    {
        expect(IsInLayerBounds(-1000, -1000, layer)).toBe(false);
    });
});
