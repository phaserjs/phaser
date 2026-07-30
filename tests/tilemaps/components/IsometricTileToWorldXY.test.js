var IsometricTileToWorldXY = require('../../../src/tilemaps/components/IsometricTileToWorldXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.IsometricTileToWorldXY', function ()
{
    var layer;

    beforeEach(function ()
    {
        layer = {
            baseTileWidth: 64,
            baseTileHeight: 32,
            tilemapLayer: null
        };
    });

    describe('point parameter', function ()
    {
        it('should create a new Vector2 when point is not provided', function ()
        {
            var result = IsometricTileToWorldXY(0, 0, null, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should create a new Vector2 when point is undefined', function ()
        {
            var result = IsometricTileToWorldXY(0, 0, undefined, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should use the provided point object and return it', function ()
        {
            var point = new Vector2();
            var result = IsometricTileToWorldXY(0, 0, point, null, layer);

            expect(result).toBe(point);
        });

        it('should update the provided point with computed coordinates', function ()
        {
            var point = new Vector2(999, 999);
            IsometricTileToWorldXY(1, 1, point, null, layer);

            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(32);
        });
    });

    describe('coordinate math without tilemapLayer', function ()
    {
        it('should return (0, 0) for tile (0, 0) with no layer offset', function ()
        {
            var result = IsometricTileToWorldXY(0, 0, null, null, layer);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('should compute correct world x from tileX=1, tileY=0', function ()
        {
            // x = 0 + (1 - 0) * (64 / 2) = 32
            // y = 0 + (1 + 0) * (32 / 2) = 16
            var result = IsometricTileToWorldXY(1, 0, null, null, layer);

            expect(result.x).toBeCloseTo(32);
            expect(result.y).toBeCloseTo(16);
        });

        it('should compute correct world y from tileX=0, tileY=1', function ()
        {
            // x = 0 + (0 - 1) * (64 / 2) = -32
            // y = 0 + (0 + 1) * (32 / 2) = 16
            var result = IsometricTileToWorldXY(0, 1, null, null, layer);

            expect(result.x).toBeCloseTo(-32);
            expect(result.y).toBeCloseTo(16);
        });

        it('should compute correct world coordinates for tileX=2, tileY=2', function ()
        {
            // x = 0 + (2 - 2) * (64 / 2) = 0
            // y = 0 + (2 + 2) * (32 / 2) = 64
            var result = IsometricTileToWorldXY(2, 2, null, null, layer);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(64);
        });

        it('should compute correct world coordinates for tileX=3, tileY=1', function ()
        {
            // x = 0 + (3 - 1) * (64 / 2) = 64
            // y = 0 + (3 + 1) * (32 / 2) = 64
            var result = IsometricTileToWorldXY(3, 1, null, null, layer);

            expect(result.x).toBeCloseTo(64);
            expect(result.y).toBeCloseTo(64);
        });

        it('should handle negative tile coordinates', function ()
        {
            // x = 0 + (-1 - (-1)) * (64 / 2) = 0
            // y = 0 + (-1 + (-1)) * (32 / 2) = -32
            var result = IsometricTileToWorldXY(-1, -1, null, null, layer);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(-32);
        });

        it('should handle mixed negative and positive tile coordinates', function ()
        {
            // x = 0 + (2 - (-1)) * (64 / 2) = 96
            // y = 0 + (2 + (-1)) * (32 / 2) = 16
            var result = IsometricTileToWorldXY(2, -1, null, null, layer);

            expect(result.x).toBeCloseTo(96);
            expect(result.y).toBeCloseTo(16);
        });

        it('should handle floating point tile coordinates', function ()
        {
            // x = 0 + (0.5 - 0.5) * 32 = 0
            // y = 0 + (0.5 + 0.5) * 16 = 16
            var result = IsometricTileToWorldXY(0.5, 0.5, null, null, layer);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(16);
        });

        it('should handle different tile sizes', function ()
        {
            layer.baseTileWidth = 128;
            layer.baseTileHeight = 64;

            // x = 0 + (1 - 0) * (128 / 2) = 64
            // y = 0 + (1 + 0) * (64 / 2) = 32
            var result = IsometricTileToWorldXY(1, 0, null, null, layer);

            expect(result.x).toBeCloseTo(64);
            expect(result.y).toBeCloseTo(32);
        });
    });

    describe('coordinate math with tilemapLayer', function ()
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

        it('should return (0, 0) for tile (0, 0) with no offsets or scrolling', function ()
        {
            var result = IsometricTileToWorldXY(0, 0, null, camera, layer);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('should account for tilemapLayer x/y position', function ()
        {
            tilemapLayer.x = 100;
            tilemapLayer.y = 50;

            // x = 100 + (0 - 0) * 32 = 100
            // y = 50 + (0 + 0) * 16 = 50
            var result = IsometricTileToWorldXY(0, 0, null, camera, layer);

            expect(result.x).toBeCloseTo(100);
            expect(result.y).toBeCloseTo(50);
        });

        it('should account for tilemapLayer scale', function ()
        {
            tilemapLayer.scaleX = 2;
            tilemapLayer.scaleY = 2;

            // tileWidth = 64 * 2 = 128, tileHeight = 32 * 2 = 64
            // x = 0 + (1 - 0) * (128 / 2) = 64
            // y = 0 + (1 + 0) * (64 / 2) = 32
            var result = IsometricTileToWorldXY(1, 0, null, camera, layer);

            expect(result.x).toBeCloseTo(64);
            expect(result.y).toBeCloseTo(32);
        });

        it('should account for camera scroll with scrollFactor of 0', function ()
        {
            tilemapLayer.scrollFactorX = 0;
            tilemapLayer.scrollFactorY = 0;
            camera.scrollX = 200;
            camera.scrollY = 100;

            // layerWorldX = 0 + 200 * (1 - 0) = 200
            // layerWorldY = 0 + 100 * (1 - 0) = 100
            // x = 200 + (0 - 0) * 32 = 200
            // y = 100 + (0 + 0) * 16 = 100
            var result = IsometricTileToWorldXY(0, 0, null, camera, layer);

            expect(result.x).toBeCloseTo(200);
            expect(result.y).toBeCloseTo(100);
        });

        it('should account for camera scroll with scrollFactor of 1 (default)', function ()
        {
            tilemapLayer.scrollFactorX = 1;
            tilemapLayer.scrollFactorY = 1;
            camera.scrollX = 200;
            camera.scrollY = 100;

            // layerWorldX = 0 + 200 * (1 - 1) = 0
            // layerWorldY = 0 + 100 * (1 - 1) = 0
            var result = IsometricTileToWorldXY(0, 0, null, camera, layer);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('should account for camera scroll with scrollFactor of 0.5', function ()
        {
            tilemapLayer.scrollFactorX = 0.5;
            tilemapLayer.scrollFactorY = 0.5;
            camera.scrollX = 100;
            camera.scrollY = 80;

            // layerWorldX = 0 + 100 * (1 - 0.5) = 50
            // layerWorldY = 0 + 80 * (1 - 0.5) = 40
            var result = IsometricTileToWorldXY(0, 0, null, camera, layer);

            expect(result.x).toBeCloseTo(50);
            expect(result.y).toBeCloseTo(40);
        });

        it('should use scene main camera when no camera is provided', function ()
        {
            tilemapLayer.scrollFactorX = 0;
            tilemapLayer.scrollFactorY = 0;
            camera.scrollX = 50;
            camera.scrollY = 25;

            // no camera passed — should fall back to tilemapLayer.scene.cameras.main
            var result = IsometricTileToWorldXY(0, 0, null, null, layer);

            // layerWorldX = 0 + 50 * 1 = 50
            // layerWorldY = 0 + 25 * 1 = 25
            expect(result.x).toBeCloseTo(50);
            expect(result.y).toBeCloseTo(25);
        });

        it('should combine layer position, scale, and camera scroll correctly', function ()
        {
            tilemapLayer.x = 10;
            tilemapLayer.y = 20;
            tilemapLayer.scaleX = 2;
            tilemapLayer.scaleY = 2;
            tilemapLayer.scrollFactorX = 0.5;
            tilemapLayer.scrollFactorY = 0.5;
            camera.scrollX = 40;
            camera.scrollY = 20;

            // layerWorldX = 10 + 40 * (1 - 0.5) = 10 + 20 = 30
            // layerWorldY = 20 + 20 * (1 - 0.5) = 20 + 10 = 30
            // tileWidth = 64 * 2 = 128, tileHeight = 32 * 2 = 64
            // x = 30 + (1 - 1) * (128 / 2) = 30
            // y = 30 + (1 + 1) * (64 / 2) = 30 + 64 = 94
            var result = IsometricTileToWorldXY(1, 1, null, camera, layer);

            expect(result.x).toBeCloseTo(30);
            expect(result.y).toBeCloseTo(94);
        });
    });

    describe('isometric geometry properties', function ()
    {
        it('should produce the same y for symmetric tile coordinates (n,0) and (0,n)', function ()
        {
            var r1 = IsometricTileToWorldXY(3, 0, null, null, layer);
            var r2 = IsometricTileToWorldXY(0, 3, null, null, layer);

            expect(r1.y).toBeCloseTo(r2.y);
        });

        it('should produce mirrored x for symmetric tile coordinates (n,0) and (0,n)', function ()
        {
            var r1 = IsometricTileToWorldXY(3, 0, null, null, layer);
            var r2 = IsometricTileToWorldXY(0, 3, null, null, layer);

            expect(r1.x).toBeCloseTo(-r2.x);
        });

        it('should yield zero world x when tileX equals tileY', function ()
        {
            var r1 = IsometricTileToWorldXY(4, 4, null, null, layer);
            var r2 = IsometricTileToWorldXY(7, 7, null, null, layer);

            expect(r1.x).toBeCloseTo(0);
            expect(r2.x).toBeCloseTo(0);
        });
    });
});
