var StaggeredWorldToTileY = require('../../../src/tilemaps/components/StaggeredWorldToTileY');

describe('Phaser.Tilemaps.Components.StaggeredWorldToTileY', function ()
{
    var layer;

    beforeEach(function ()
    {
        layer = {
            baseTileHeight: 32,
            tilemapLayer: null
        };
    });

    describe('without a tilemapLayer (no camera/scroll adjustment)', function ()
    {
        it('should convert world Y to staggered tile Y with snapToFloor true', function ()
        {
            expect(StaggeredWorldToTileY(32, true, null, layer)).toBe(2);
        });

        it('should convert world Y to staggered tile Y with snapToFloor false', function ()
        {
            expect(StaggeredWorldToTileY(32, false, null, layer)).toBe(2);
        });

        it('should return zero for worldY of zero', function ()
        {
            expect(StaggeredWorldToTileY(0, true, null, layer)).toBe(0);
            expect(StaggeredWorldToTileY(0, false, null, layer)).toBe(0);
        });

        it('should use tileHeight / 2 as the divisor', function ()
        {
            // tileHeight = 32, half = 16
            expect(StaggeredWorldToTileY(16, false, null, layer)).toBe(1);
            expect(StaggeredWorldToTileY(48, false, null, layer)).toBe(3);
        });

        it('should floor fractional tile Y when snapToFloor is true', function ()
        {
            // worldY=20, tileHeight=32, half=16 => 20/16 = 1.25 => floor => 1
            expect(StaggeredWorldToTileY(20, true, null, layer)).toBe(1);
        });

        it('should return fractional tile Y when snapToFloor is false', function ()
        {
            // worldY=20, tileHeight=32, half=16 => 20/16 = 1.25
            expect(StaggeredWorldToTileY(20, false, null, layer)).toBeCloseTo(1.25);
        });

        it('should handle negative worldY with snapToFloor true', function ()
        {
            // worldY=-16, half=16 => -16/16 = -1 => floor(-1) = -1
            expect(StaggeredWorldToTileY(-16, true, null, layer)).toBe(-1);
        });

        it('should handle negative worldY with snapToFloor false', function ()
        {
            expect(StaggeredWorldToTileY(-16, false, null, layer)).toBe(-1);
        });

        it('should floor negative fractional tile Y when snapToFloor is true', function ()
        {
            // worldY=-20, half=16 => -20/16 = -1.25 => floor => -2
            expect(StaggeredWorldToTileY(-20, true, null, layer)).toBe(-2);
        });

        it('should return negative fractional tile Y when snapToFloor is false', function ()
        {
            expect(StaggeredWorldToTileY(-20, false, null, layer)).toBeCloseTo(-1.25);
        });

        it('should work with different baseTileHeight values', function ()
        {
            layer.baseTileHeight = 64;
            // half = 32 => worldY=64/32 = 2
            expect(StaggeredWorldToTileY(64, true, null, layer)).toBe(2);
            expect(StaggeredWorldToTileY(64, false, null, layer)).toBeCloseTo(2);
        });

        it('should work with floating point worldY', function ()
        {
            // worldY=8.5, half=16 => 8.5/16 = 0.53125 => floor => 0
            expect(StaggeredWorldToTileY(8.5, true, null, layer)).toBe(0);
            expect(StaggeredWorldToTileY(8.5, false, null, layer)).toBeCloseTo(0.53125);
        });
    });

    describe('with a tilemapLayer (camera/scroll adjustment)', function ()
    {
        var camera;
        var tilemapLayer;

        beforeEach(function ()
        {
            camera = {
                scrollY: 0
            };

            tilemapLayer = {
                y: 0,
                scaleY: 1,
                scrollFactorY: 1,
                scene: {
                    cameras: {
                        main: camera
                    }
                }
            };

            layer.tilemapLayer = tilemapLayer;
        });

        it('should use the provided camera when given', function ()
        {
            expect(StaggeredWorldToTileY(32, true, camera, layer)).toBe(2);
        });

        it('should fall back to scene main camera when camera is null', function ()
        {
            expect(StaggeredWorldToTileY(32, true, null, layer)).toBe(2);
        });

        it('should subtract tilemapLayer.y from worldY', function ()
        {
            tilemapLayer.y = 16;
            // adjusted worldY = 32 - 16 = 16, half = 16 => 1
            expect(StaggeredWorldToTileY(32, true, camera, layer)).toBe(1);
        });

        it('should factor in camera scrollY with scrollFactorY of 1', function ()
        {
            camera.scrollY = 16;
            tilemapLayer.scrollFactorY = 1;
            // adjusted worldY = 32 - (0 + 16 * (1 - 1)) = 32 - 0 = 32, half=16 => 2
            expect(StaggeredWorldToTileY(32, true, camera, layer)).toBe(2);
        });

        it('should factor in camera scrollY with scrollFactorY of 0', function ()
        {
            camera.scrollY = 16;
            tilemapLayer.scrollFactorY = 0;
            // adjusted worldY = 32 - (0 + 16 * (1 - 0)) = 32 - 16 = 16, half=16 => 1
            expect(StaggeredWorldToTileY(32, true, camera, layer)).toBe(1);
        });

        it('should factor in camera scrollY with scrollFactorY of 0.5', function ()
        {
            camera.scrollY = 16;
            tilemapLayer.scrollFactorY = 0.5;
            // adjusted worldY = 32 - (0 + 16 * 0.5) = 32 - 8 = 24, half=16 => 1.5 => floor => 1
            expect(StaggeredWorldToTileY(32, true, camera, layer)).toBe(1);
        });

        it('should scale tileHeight by tilemapLayer.scaleY', function ()
        {
            tilemapLayer.scaleY = 2;
            // tileHeight = 32 * 2 = 64, half = 32 => worldY=64/32 = 2
            expect(StaggeredWorldToTileY(64, true, camera, layer)).toBe(2);
        });

        it('should scale tileHeight by scaleY of 0.5', function ()
        {
            tilemapLayer.scaleY = 0.5;
            // tileHeight = 32 * 0.5 = 16, half = 8 => worldY=16/8 = 2
            expect(StaggeredWorldToTileY(16, true, camera, layer)).toBe(2);
        });

        it('should combine layer offset, scroll, and scale correctly', function ()
        {
            tilemapLayer.y = 8;
            camera.scrollY = 20;
            tilemapLayer.scrollFactorY = 0.5;
            tilemapLayer.scaleY = 2;
            // adjusted worldY = 100 - (8 + 20 * (1 - 0.5)) = 100 - (8 + 10) = 82
            // tileHeight = 32 * 2 = 64, half = 32 => 82/32 = 2.5625 => floor => 2
            expect(StaggeredWorldToTileY(100, true, camera, layer)).toBe(2);
            expect(StaggeredWorldToTileY(100, false, camera, layer)).toBeCloseTo(2.5625);
        });

        it('should return fractional result when snapToFloor is false with scale', function ()
        {
            tilemapLayer.scaleY = 2;
            // tileHeight = 64, half = 32 => worldY=48/32 = 1.5
            expect(StaggeredWorldToTileY(48, false, camera, layer)).toBeCloseTo(1.5);
        });
    });
});
