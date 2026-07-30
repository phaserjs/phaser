var WorldToTileXY = require('../../../src/tilemaps/components/WorldToTileXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.WorldToTileXY', function ()
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

    describe('without a tilemapLayer', function ()
    {
        it('should convert world coordinates to tile coordinates using baseTileSize', function ()
        {
            var result = WorldToTileXY(64, 96, true, null, null, layer);

            expect(result.x).toBe(2);
            expect(result.y).toBe(3);
        });

        it('should return a Vector2 when no point is provided', function ()
        {
            var result = WorldToTileXY(32, 32, true, null, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should update the provided point object', function ()
        {
            var point = new Vector2(0, 0);
            var result = WorldToTileXY(64, 128, true, point, null, layer);

            expect(result).toBe(point);
            expect(point.x).toBe(2);
            expect(point.y).toBe(4);
        });

        it('should snap to floor when snapToFloor is true', function ()
        {
            var result = WorldToTileXY(50, 50, true, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(1);
        });

        it('should not snap to floor when snapToFloor is false', function ()
        {
            var result = WorldToTileXY(50, 50, false, null, null, layer);

            expect(result.x).toBeCloseTo(1.5625);
            expect(result.y).toBeCloseTo(1.5625);
        });

        it('should default snapToFloor to true when undefined', function ()
        {
            var result = WorldToTileXY(50, 50, undefined, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(1);
        });

        it('should return zero tile coordinates for world position 0,0', function ()
        {
            var result = WorldToTileXY(0, 0, true, null, null, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should handle fractional world coordinates with snapToFloor true', function ()
        {
            var result = WorldToTileXY(31, 31, true, null, null, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should handle fractional world coordinates with snapToFloor false', function ()
        {
            var result = WorldToTileXY(31, 31, false, null, null, layer);

            expect(result.x).toBeCloseTo(0.96875);
            expect(result.y).toBeCloseTo(0.96875);
        });

        it('should handle negative world coordinates with snapToFloor true', function ()
        {
            var result = WorldToTileXY(-32, -64, true, null, null, layer);

            expect(result.x).toBe(-1);
            expect(result.y).toBe(-2);
        });

        it('should handle negative world coordinates with snapToFloor false', function ()
        {
            var result = WorldToTileXY(-16, -16, false, null, null, layer);

            expect(result.x).toBeCloseTo(-0.5);
            expect(result.y).toBeCloseTo(-0.5);
        });

        it('should handle non-square tile sizes', function ()
        {
            layer.baseTileWidth = 16;
            layer.baseTileHeight = 64;

            var result = WorldToTileXY(64, 128, true, null, null, layer);

            expect(result.x).toBe(4);
            expect(result.y).toBe(2);
        });

        it('should handle exact tile boundary coordinates', function ()
        {
            var result = WorldToTileXY(32, 32, true, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(1);
        });

        it('should handle large world coordinates', function ()
        {
            var result = WorldToTileXY(3200, 6400, true, null, null, layer);

            expect(result.x).toBe(100);
            expect(result.y).toBe(200);
        });
    });

    describe('with a tilemapLayer', function ()
    {
        var camera;
        var tilemapLayer;

        beforeEach(function ()
        {
            camera = {
                scrollX: 0,
                scrollY: 0
            };

            tilemapLayer = {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                scrollFactorX: 1,
                scrollFactorY: 1,
                scene: {
                    cameras: {
                        main: camera
                    }
                }
            };

            layer.tilemapLayer = tilemapLayer;
        });

        it('should convert world coordinates factoring in layer position', function ()
        {
            tilemapLayer.x = 64;
            tilemapLayer.y = 64;

            var result = WorldToTileXY(128, 128, true, null, camera, layer);

            expect(result.x).toBe(2);
            expect(result.y).toBe(2);
        });

        it('should factor in camera scroll', function ()
        {
            camera.scrollX = 32;
            camera.scrollY = 32;
            tilemapLayer.scrollFactorX = 0;
            tilemapLayer.scrollFactorY = 0;

            var result = WorldToTileXY(64, 64, true, null, camera, layer);

            // worldX = 64 - (0 + 32 * (1 - 0)) = 32 => tile 1
            // worldY = 64 - (0 + 32 * (1 - 0)) = 32 => tile 1
            expect(result.x).toBe(1);
            expect(result.y).toBe(1);
        });

        it('should factor in layer scale', function ()
        {
            tilemapLayer.scaleX = 2;
            tilemapLayer.scaleY = 2;

            var result = WorldToTileXY(64, 64, true, null, camera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(1);
        });

        it('should use scene main camera when no camera is provided', function ()
        {
            tilemapLayer.x = 0;
            tilemapLayer.y = 0;

            var result = WorldToTileXY(64, 64, true, null, null, layer);

            expect(result.x).toBe(2);
            expect(result.y).toBe(2);
        });

        it('should factor in scrollFactorX and scrollFactorY', function ()
        {
            camera.scrollX = 64;
            camera.scrollY = 64;
            tilemapLayer.scrollFactorX = 0.5;
            tilemapLayer.scrollFactorY = 0.5;

            var result = WorldToTileXY(64, 64, true, null, camera, layer);

            // worldX = 64 - (0 + 64 * (1 - 0.5)) = 64 - 32 = 32 => tile 1
            // worldY = 64 - (0 + 64 * (1 - 0.5)) = 64 - 32 = 32 => tile 1
            expect(result.x).toBe(1);
            expect(result.y).toBe(1);
        });

        it('should handle layer offset combined with scale', function ()
        {
            tilemapLayer.x = 32;
            tilemapLayer.y = 32;
            tilemapLayer.scaleX = 2;
            tilemapLayer.scaleY = 2;

            // worldX = 96 - 32 = 64, tileWidth = 32 * 2 = 64, x = 1
            var result = WorldToTileXY(96, 96, true, null, camera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(1);
        });

        it('should update provided point when tilemapLayer is set', function ()
        {
            var point = new Vector2(99, 99);

            WorldToTileXY(64, 64, true, point, camera, layer);

            expect(point.x).toBe(2);
            expect(point.y).toBe(2);
        });

        it('should handle snapToFloor false with tilemapLayer', function ()
        {
            var result = WorldToTileXY(50, 50, false, null, camera, layer);

            expect(result.x).toBeCloseTo(1.5625);
            expect(result.y).toBeCloseTo(1.5625);
        });
    });
});
