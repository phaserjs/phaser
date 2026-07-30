var StaggeredWorldToTileXY = require('../../../src/tilemaps/components/StaggeredWorldToTileXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.StaggeredWorldToTileXY', function ()
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

    describe('return value', function ()
    {
        it('should return a Vector2', function ()
        {
            var result = StaggeredWorldToTileXY(0, 0, true, null, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should create a new Vector2 when no point is provided', function ()
        {
            var result = StaggeredWorldToTileXY(32, 32, true, null, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should use and return the provided point object', function ()
        {
            var point = new Vector2();
            var result = StaggeredWorldToTileXY(32, 32, true, point, null, layer);

            expect(result).toBe(point);
        });

        it('should set x and y on the provided plain object if it has a set method', function ()
        {
            var point = new Vector2();
            StaggeredWorldToTileXY(64, 64, true, point, null, layer);

            expect(point.x).toBe(2);
            expect(point.y).toBe(4);
        });
    });

    describe('coordinate conversion without tilemapLayer', function ()
    {
        it('should return (0, 0) for world origin', function ()
        {
            var result = StaggeredWorldToTileXY(0, 0, true, null, null, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should convert world coordinates to staggered tile coordinates with snapToFloor true', function ()
        {
            // tileHeight = 32, tileHeight/2 = 16
            // y = floor(32 / 16) = 2
            // x = floor((32 + (2 % 2) * 0.5 * 32) / 32) = floor(32 / 32) = 1
            var result = StaggeredWorldToTileXY(32, 32, true, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should return exact (non-floored) values when snapToFloor is false', function ()
        {
            // y = 32 / 16 = 2.0, x = (32 + 0) / 32 = 1.0
            var result = StaggeredWorldToTileXY(32, 32, false, null, null, layer);

            expect(result.x).toBeCloseTo(1.0);
            expect(result.y).toBeCloseTo(2.0);
        });

        it('should floor fractional tile coordinates when snapToFloor is true', function ()
        {
            // y = floor(10 / 16) = 0
            // x = floor((10 + 0) / 32) = 0
            var result = StaggeredWorldToTileXY(10, 10, true, null, null, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should return fractional tile coordinates when snapToFloor is false', function ()
        {
            // y = 10 / 16 = 0.625
            // x = (10 + (0.625 % 2) * 0.5 * 32) / 32 = (10 + 10) / 32 = 0.625
            var result = StaggeredWorldToTileXY(10, 10, false, null, null, layer);

            expect(result.y).toBeCloseTo(0.625);
        });

        it('should apply stagger offset on odd rows', function ()
        {
            // y = floor(16 / 16) = 1 (odd row)
            // x = floor((0 + (1 % 2) * 0.5 * 32) / 32) = floor(16 / 32) = 0
            var result = StaggeredWorldToTileXY(0, 16, true, null, null, layer);

            expect(result.y).toBe(1);
            expect(result.x).toBe(0);
        });

        it('should not apply stagger offset on even rows', function ()
        {
            // y = floor(32 / 16) = 2 (even row)
            // x = floor((32 + (2 % 2) * 0.5 * 32) / 32) = floor(32 / 32) = 1
            var result = StaggeredWorldToTileXY(32, 32, true, null, null, layer);

            expect(result.y).toBe(2);
            expect(result.x).toBe(1);
        });

        it('should handle large tile dimensions', function ()
        {
            layer.baseTileWidth = 64;
            layer.baseTileHeight = 64;

            // y = floor(64 / 32) = 2
            // x = floor((64 + 0) / 64) = 1
            var result = StaggeredWorldToTileXY(64, 64, true, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should handle non-square tile dimensions', function ()
        {
            layer.baseTileWidth = 32;
            layer.baseTileHeight = 16;

            // tileHeight/2 = 8
            // y = floor(16 / 8) = 2
            // x = floor((32 + 0) / 32) = 1
            var result = StaggeredWorldToTileXY(32, 16, true, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should handle negative world coordinates with snapToFloor true', function ()
        {
            // y = floor(-16 / 16) = -1
            // x = floor((-32 + (-1 % 2) * 0.5 * 32) / 32) = floor((-32 + -16) / 32) = floor(-1.5) = -2
            var result = StaggeredWorldToTileXY(-32, -16, true, null, null, layer);

            expect(result.y).toBe(-1);
            expect(result.x).toBe(-2);
        });

        it('should handle negative world coordinates with snapToFloor false', function ()
        {
            var result = StaggeredWorldToTileXY(-32, -16, false, null, null, layer);

            expect(result.y).toBeCloseTo(-1.0);
        });

        it('should handle zero tile position', function ()
        {
            var result = StaggeredWorldToTileXY(0, 0, false, null, null, layer);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('should handle floating point world coordinates', function ()
        {
            var result = StaggeredWorldToTileXY(32.5, 32.5, false, null, null, layer);

            expect(result.y).toBeCloseTo(32.5 / 16);
        });
    });

    describe('coordinate conversion with tilemapLayer', function ()
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

        it('should use provided camera instead of scene main camera', function ()
        {
            var customCamera = {
                scrollX: 0,
                scrollY: 0
            };

            var result = StaggeredWorldToTileXY(32, 32, true, null, customCamera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should fall back to scene main camera when no camera provided', function ()
        {
            var result = StaggeredWorldToTileXY(32, 32, true, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should account for layer x position', function ()
        {
            tilemapLayer.x = 32;

            // worldX becomes 64 - 32 = 32
            var result = StaggeredWorldToTileXY(64, 32, true, null, camera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should account for layer y position', function ()
        {
            tilemapLayer.y = 16;

            // worldY becomes 48 - 16 = 32
            var result = StaggeredWorldToTileXY(32, 48, true, null, camera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should account for camera horizontal scroll', function ()
        {
            camera.scrollX = 32;
            tilemapLayer.scrollFactorX = 0;

            // worldX becomes 64 - (0 + 32 * 1) = 32
            var result = StaggeredWorldToTileXY(64, 32, true, null, camera, layer);

            expect(result.x).toBe(1);
        });

        it('should account for camera vertical scroll', function ()
        {
            camera.scrollY = 16;
            tilemapLayer.scrollFactorY = 0;

            // worldY becomes 48 - (0 + 16 * 1) = 32
            var result = StaggeredWorldToTileXY(32, 48, true, null, camera, layer);

            expect(result.y).toBe(2);
        });

        it('should apply scaleX to tile width', function ()
        {
            tilemapLayer.scaleX = 2;

            // tileWidth becomes 32 * 2 = 64
            // y = floor(32 / 16) = 2 (even)
            // x = floor((64 + 0) / 64) = 1
            var result = StaggeredWorldToTileXY(64, 32, true, null, camera, layer);

            expect(result.x).toBe(1);
        });

        it('should apply scaleY to tile height', function ()
        {
            tilemapLayer.scaleY = 2;

            // tileHeight becomes 32 * 2 = 64, tileHeight/2 = 32
            // y = floor(64 / 32) = 2
            var result = StaggeredWorldToTileXY(32, 64, true, null, camera, layer);

            expect(result.y).toBe(2);
        });

        it('should respect scrollFactorX of 1 (default, full camera scroll)', function ()
        {
            camera.scrollX = 32;
            tilemapLayer.scrollFactorX = 1;

            // scrollX contribution = 32 * (1 - 1) = 0
            // worldX unchanged from raw: 64 - 0 = 64
            var result = StaggeredWorldToTileXY(64, 32, true, null, camera, layer);

            expect(result.x).toBe(2);
        });

        it('should respect scrollFactorX of 0 (no camera scroll applied)', function ()
        {
            camera.scrollX = 100;
            tilemapLayer.scrollFactorX = 0;

            // scrollX contribution = 100 * (1 - 0) = 100
            // worldX: 132 - (0 + 100) = 32
            var result = StaggeredWorldToTileXY(132, 32, true, null, camera, layer);

            expect(result.x).toBe(1);
        });
    });
});
