var WorldToTileX = require('../../../src/tilemaps/components/WorldToTileX');

describe('Phaser.Tilemaps.Components.WorldToTileX', function ()
{
    var layer;

    function makeLayer (tileWidth, tileHeight)
    {
        return {
            baseTileWidth: tileWidth || 32,
            baseTileHeight: tileHeight || 32,
            tilemapLayer: null
        };
    }

    function makeLayerWithTilemapLayer (tileWidth, tileHeight, layerX, layerY, scaleX, scaleY, scrollFactorX)
    {
        var camera = { scrollX: 0, scrollY: 0 };
        return {
            baseTileWidth: tileWidth || 32,
            baseTileHeight: tileHeight || 32,
            tilemapLayer: {
                x: layerX || 0,
                y: layerY || 0,
                scaleX: scaleX || 1,
                scaleY: scaleY || 1,
                scrollFactorX: scrollFactorX !== undefined ? scrollFactorX : 1,
                scrollFactorY: 1,
                scene: { cameras: { main: camera } }
            }
        };
    }

    beforeEach(function ()
    {
        layer = makeLayer();
    });

    it('should return tile X coordinate for a basic world X position', function ()
    {
        expect(WorldToTileX(32, true, null, layer)).toBe(1);
    });

    it('should return zero for world X of zero', function ()
    {
        expect(WorldToTileX(0, true, null, layer)).toBe(0);
    });

    it('should floor the result when snapToFloor is true', function ()
    {
        expect(WorldToTileX(33, true, null, layer)).toBe(1);
        expect(WorldToTileX(63, true, null, layer)).toBe(1);
        expect(WorldToTileX(64, true, null, layer)).toBe(2);
    });

    it('should not floor the result when snapToFloor is false', function ()
    {
        expect(WorldToTileX(33, false, null, layer)).toBeCloseTo(1.03125);
        expect(WorldToTileX(48, false, null, layer)).toBeCloseTo(1.5);
    });

    it('should handle negative world X values with snapToFloor true', function ()
    {
        expect(WorldToTileX(-32, true, null, layer)).toBe(-1);
        expect(WorldToTileX(-1, true, null, layer)).toBe(-1);
        expect(WorldToTileX(-64, true, null, layer)).toBe(-2);
    });

    it('should handle negative world X values with snapToFloor false', function ()
    {
        expect(WorldToTileX(-16, false, null, layer)).toBeCloseTo(-0.5);
    });

    it('should use tile width from layer baseTileWidth', function ()
    {
        var layer16 = makeLayer(16, 16);
        expect(WorldToTileX(16, true, null, layer16)).toBe(1);
        expect(WorldToTileX(32, true, null, layer16)).toBe(2);
    });

    it('should account for tilemapLayer x offset', function ()
    {
        var layerWithOffset = makeLayerWithTilemapLayer(32, 32, 64, 0);
        var camera = { scrollX: 0, scrollY: 0 };
        // worldX=96, layer.x=64 => effective = 96-64 = 32 => tile 1
        expect(WorldToTileX(96, true, camera, layerWithOffset)).toBe(1);
    });

    it('should account for camera scrollX with scrollFactorX of 0', function ()
    {
        var l = makeLayerWithTilemapLayer(32, 32, 0, 0, 1, 1, 0);
        var camera = { scrollX: 32, scrollY: 0 };
        // scrollFactorX=0: worldX - (0 + scrollX*(1-0)) = 64 - 32 = 32 => tile 1
        expect(WorldToTileX(64, true, camera, l)).toBe(1);
    });

    it('should not be affected by camera scrollX when scrollFactorX is 1', function ()
    {
        var l = makeLayerWithTilemapLayer(32, 32, 0, 0, 1, 1, 1);
        var camera = { scrollX: 32, scrollY: 0 };
        // scrollFactorX=1: worldX - (0 + scrollX*(1-1)) = worldX unchanged => 32/32 = tile 1
        expect(WorldToTileX(32, true, camera, l)).toBe(1);
    });

    it('should account for tilemapLayer scaleX', function ()
    {
        var l = makeLayerWithTilemapLayer(32, 32, 0, 0, 2, 1);
        var camera = { scrollX: 0, scrollY: 0 };
        // tileWidth = 32 * 2 = 64; worldX=64 => tile 1
        expect(WorldToTileX(64, true, camera, l)).toBe(1);
        expect(WorldToTileX(128, true, camera, l)).toBe(2);
    });

    it('should return a number type', function ()
    {
        var result = WorldToTileX(100, true, null, layer);
        expect(typeof result).toBe('number');
    });

    it('should handle large world X values', function ()
    {
        expect(WorldToTileX(3200, true, null, layer)).toBe(100);
    });

    it('should handle fractional world X with snapToFloor true', function ()
    {
        expect(WorldToTileX(31.9, true, null, layer)).toBe(0);
        expect(WorldToTileX(32.1, true, null, layer)).toBe(1);
    });

    it('should handle fractional world X with snapToFloor false', function ()
    {
        expect(WorldToTileX(16, false, null, layer)).toBeCloseTo(0.5);
    });

    it('should use scene default camera when camera is null and tilemapLayer exists', function ()
    {
        var l = makeLayerWithTilemapLayer(32, 32, 0, 0, 1, 1, 1);
        // camera is null — tilemapLayer.scene.cameras.main (scrollX=0) will be used
        expect(WorldToTileX(32, true, null, l)).toBe(1);
    });
});
