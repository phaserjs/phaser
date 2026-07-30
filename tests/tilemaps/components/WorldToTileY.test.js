var WorldToTileY = require('../../../src/tilemaps/components/WorldToTileY');

describe('Phaser.Tilemaps.Components.WorldToTileY', function ()
{
    var layer;

    beforeEach(function ()
    {
        layer = {
            baseTileWidth: 32,
            baseTileHeight: 32,
            tilemapLayer: null
        };
    });

    it('should return zero when worldY is zero', function ()
    {
        expect(WorldToTileY(0, true, null, layer)).toBe(0);
    });

    it('should convert a positive world Y to tile Y with snapToFloor true', function ()
    {
        expect(WorldToTileY(64, true, null, layer)).toBe(2);
    });

    it('should convert a positive world Y to tile Y with snapToFloor false', function ()
    {
        expect(WorldToTileY(64, false, null, layer)).toBe(2);
    });

    it('should floor the result when snapToFloor is true', function ()
    {
        expect(WorldToTileY(48, true, null, layer)).toBe(1);
    });

    it('should return fractional result when snapToFloor is false', function ()
    {
        expect(WorldToTileY(48, false, null, layer)).toBeCloseTo(1.5);
    });

    it('should handle negative world Y values with snapToFloor true', function ()
    {
        expect(WorldToTileY(-32, true, null, layer)).toBe(-1);
    });

    it('should handle negative world Y values with snapToFloor false', function ()
    {
        expect(WorldToTileY(-32, false, null, layer)).toBeCloseTo(-1);
    });

    it('should handle negative fractional world Y with snapToFloor true', function ()
    {
        expect(WorldToTileY(-16, true, null, layer)).toBe(-1);
    });

    it('should handle negative fractional world Y with snapToFloor false', function ()
    {
        expect(WorldToTileY(-16, false, null, layer)).toBeCloseTo(-0.5);
    });

    it('should respect different baseTileHeight values', function ()
    {
        layer.baseTileHeight = 16;
        expect(WorldToTileY(64, true, null, layer)).toBe(4);
    });

    it('should respect baseTileHeight of 64', function ()
    {
        layer.baseTileHeight = 64;
        expect(WorldToTileY(64, true, null, layer)).toBe(1);
    });

    it('should return correct tile Y for large world Y values', function ()
    {
        expect(WorldToTileY(320, true, null, layer)).toBe(10);
    });

    it('should factor in tilemapLayer position when tilemapLayer is present', function ()
    {
        layer.tilemapLayer = {
            x: 0,
            y: 32,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 1,
            scene: {
                cameras: {
                    main: { scrollX: 0, scrollY: 0 }
                }
            }
        };

        // worldY=64, layer.y=32, so effective worldY=32 → tile 1
        expect(WorldToTileY(64, true, null, layer)).toBe(1);
    });

    it('should factor in camera scrollY when tilemapLayer is present', function ()
    {
        var camera = { scrollX: 0, scrollY: 32 };
        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 1,
            scene: {
                cameras: {
                    main: camera
                }
            }
        };

        // worldY=64, camera.scrollY=32, scrollFactorY=1 → effective worldY = 64 - 32*(1-1)=64, but layer.y=0
        // scrollFactorY=1 means (1 - scrollFactorY)=0, so no scroll effect
        expect(WorldToTileY(64, true, camera, layer)).toBe(2);
    });

    it('should factor in camera scrollY with scrollFactorY of zero', function ()
    {
        var camera = { scrollX: 0, scrollY: 32 };
        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scrollFactorX: 1,
            scrollFactorY: 0,
            scaleX: 1,
            scaleY: 1,
            scene: {
                cameras: {
                    main: camera
                }
            }
        };

        // worldY=96, layer.y=0, scrollY=32, scrollFactorY=0 → effective worldY = 96 - (0 + 32*(1-0)) = 96 - 32 = 64 → tile 2
        expect(WorldToTileY(96, true, camera, layer)).toBe(2);
    });

    it('should factor in tilemapLayer scaleY', function ()
    {
        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 2,
            scene: {
                cameras: {
                    main: { scrollX: 0, scrollY: 0 }
                }
            }
        };

        // tileHeight = 32 * scaleY(2) = 64, worldY=128 → tile 2
        expect(WorldToTileY(128, true, null, layer)).toBe(2);
    });

    it('should return a number type', function ()
    {
        var result = WorldToTileY(100, true, null, layer);
        expect(typeof result).toBe('number');
    });

    it('should only return the Y component, not X', function ()
    {
        // X input is always 0 internally; result should only reflect worldY
        var result1 = WorldToTileY(32, true, null, layer);
        var result2 = WorldToTileY(96, true, null, layer);
        expect(result1).toBe(1);
        expect(result2).toBe(3);
    });
});
