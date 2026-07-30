var IsometricWorldToTileXY = require('../../../src/tilemaps/components/IsometricWorldToTileXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.IsometricWorldToTileXY', function ()
{
    // Standard isometric tile: 128 wide, 64 tall
    // tileWidthHalf = 64, tileHeightHalf = 32
    // Origin (tile 0,0) is at worldX=64, worldY=0
    // Tile (1,0) is at worldX=128, worldY=32
    // Tile (0,1) is at worldX=0,   worldY=32

    var layer;

    beforeEach(function ()
    {
        layer = {
            baseTileWidth: 128,
            baseTileHeight: 64,
            tilemapLayer: null
        };
    });

    it('should return a Vector2', function ()
    {
        var result = IsometricWorldToTileXY(64, 0, false, null, null, layer, true);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should create a new Vector2 when point is null', function ()
    {
        var result = IsometricWorldToTileXY(64, 0, false, null, null, layer, true);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    it('should update the provided point object instead of creating a new one', function ()
    {
        var point = new Vector2();
        var result = IsometricWorldToTileXY(64, 0, false, point, null, layer, true);

        expect(result).toBe(point);
    });

    it('should convert origin world position (64, 0) to tile (0, 0) with originTop=true', function ()
    {
        var result = IsometricWorldToTileXY(64, 0, false, null, null, layer, true);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should convert world (128, 32) to tile (1, 0) with originTop=true', function ()
    {
        var result = IsometricWorldToTileXY(128, 32, false, null, null, layer, true);

        expect(result.x).toBeCloseTo(1);
        expect(result.y).toBeCloseTo(0);
    });

    it('should convert world (0, 32) to tile (0, 1) with originTop=true', function ()
    {
        var result = IsometricWorldToTileXY(0, 32, false, null, null, layer, true);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(1);
    });

    it('should convert world (64, 64) to tile (1, 1) with originTop=true', function ()
    {
        // adjX = 64 - 64 = 0, worldY = 64
        // x = 0.5 * (0/64 + 64/32) = 0.5 * (0 + 2) = 1
        // y = 0.5 * (-0/64 + 64/32) = 0.5 * (0 + 2) = 1
        var result = IsometricWorldToTileXY(64, 64, false, null, null, layer, true);

        expect(result.x).toBeCloseTo(1);
        expect(result.y).toBeCloseTo(1);
    });

    it('should convert world (0, 0) to tile (-0.5, 0.5) with originTop=true', function ()
    {
        var result = IsometricWorldToTileXY(0, 0, false, null, null, layer, true);

        expect(result.x).toBeCloseTo(-0.5);
        expect(result.y).toBeCloseTo(0.5);
    });

    it('should snap to floor when snapToFloor is true', function ()
    {
        // worldX=100, worldY=20 gives non-integer tile coords
        var snapped = IsometricWorldToTileXY(100, 20, true, null, null, layer, true);
        var unsnapped = IsometricWorldToTileXY(100, 20, false, null, null, layer, true);

        expect(snapped.x).toBe(Math.floor(unsnapped.x));
        expect(snapped.y).toBe(Math.floor(unsnapped.y));
    });

    it('should return integer tile coordinates when snapToFloor is true', function ()
    {
        var result = IsometricWorldToTileXY(100, 20, true, null, null, layer, true);

        expect(result.x).toBe(Math.floor(result.x));
        expect(result.y).toBe(Math.floor(result.y));
    });

    it('should not snap to floor when snapToFloor is false', function ()
    {
        var result = IsometricWorldToTileXY(100, 20, false, null, null, layer, true);

        // result should be fractional
        expect(result.x % 1 !== 0 || result.y % 1 !== 0).toBe(true);
    });

    it('should shift worldY down by tileHeight when originTop is false', function ()
    {
        var resultTop = IsometricWorldToTileXY(64, 64, false, null, null, layer, true);
        var resultBase = IsometricWorldToTileXY(64, 64 + 64, false, null, null, layer, false);

        expect(resultBase.x).toBeCloseTo(resultTop.x);
        expect(resultBase.y).toBeCloseTo(resultTop.y);
    });

    it('should treat undefined originTop as falsy (same as originTop=false)', function ()
    {
        // !undefined is true, so it applies the base-face offset like originTop=false
        var resultUndefined = IsometricWorldToTileXY(64, 0, false, null, null, layer, undefined);
        var resultFalse = IsometricWorldToTileXY(64, 0, false, null, null, layer, false);

        expect(resultUndefined.x).toBeCloseTo(resultFalse.x);
        expect(resultUndefined.y).toBeCloseTo(resultFalse.y);
    });

    it('should handle negative world coordinates', function ()
    {
        var result = IsometricWorldToTileXY(-64, -32, false, null, null, layer, true);

        // adjX = -64 - 64 = -128, worldY = -32
        // x = 0.5 * (-128/64 + -32/32) = 0.5 * (-2 + -1) = -1.5
        // y = 0.5 * (128/64 + -32/32) = 0.5 * (2 + -1) = 0.5
        expect(result.x).toBeCloseTo(-1.5);
        expect(result.y).toBeCloseTo(0.5);
    });

    it('should handle large positive world coordinates', function ()
    {
        var result = IsometricWorldToTileXY(1344, 320, false, null, null, layer, true);

        // adjX = 1344 - 64 = 1280, worldY = 320
        // x = 0.5 * (1280/64 + 320/32) = 0.5 * (20 + 10) = 15
        // y = 0.5 * (-1280/64 + 320/32) = 0.5 * (-20 + 10) = -5
        expect(result.x).toBeCloseTo(15);
        expect(result.y).toBeCloseTo(-5);
    });

    it('should handle world (0, 0) with snapToFloor flooring negative fractional values', function ()
    {
        var result = IsometricWorldToTileXY(0, 0, true, null, null, layer, true);

        // unsnapped: x=-0.5, y=0.5 → floor(-0.5)=-1, floor(0.5)=0
        expect(result.x).toBe(-1);
        expect(result.y).toBe(0);
    });

    describe('with tilemapLayer', function ()
    {
        var layerWithTilemapLayer;
        var camera;

        beforeEach(function ()
        {
            camera = {
                scrollX: 0,
                scrollY: 0
            };

            layerWithTilemapLayer = {
                baseTileWidth: 128,
                baseTileHeight: 64,
                tilemapLayer: {
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
                }
            };
        });

        it('should produce the same result as no tilemapLayer when all transforms are identity', function ()
        {
            var resultPlain = IsometricWorldToTileXY(128, 32, false, null, null, layer, true);
            var resultLayer = IsometricWorldToTileXY(128, 32, false, null, camera, layerWithTilemapLayer, true);

            expect(resultLayer.x).toBeCloseTo(resultPlain.x);
            expect(resultLayer.y).toBeCloseTo(resultPlain.y);
        });

        it('should use the provided camera when given', function ()
        {
            var explicitCamera = { scrollX: 0, scrollY: 0 };
            var result = IsometricWorldToTileXY(128, 32, false, null, explicitCamera, layerWithTilemapLayer, true);

            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(0);
        });

        it('should fall back to scene main camera when no camera is provided', function ()
        {
            var result = IsometricWorldToTileXY(128, 32, false, null, null, layerWithTilemapLayer, true);

            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(0);
        });

        it('should offset world position by tilemapLayer x/y', function ()
        {
            layerWithTilemapLayer.tilemapLayer.x = 64;
            layerWithTilemapLayer.tilemapLayer.y = 32;

            // worldX adjusted: 192 - (64 + 0) = 128, worldY adjusted: 64 - (32 + 0) = 32
            var result = IsometricWorldToTileXY(192, 64, false, null, camera, layerWithTilemapLayer, true);

            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(0);
        });

        it('should account for camera scroll with scrollFactor < 1', function ()
        {
            camera.scrollX = 100;
            camera.scrollY = 50;
            layerWithTilemapLayer.tilemapLayer.scrollFactorX = 0.5;
            layerWithTilemapLayer.tilemapLayer.scrollFactorY = 0.5;

            // worldY adjusted: worldY - (0 + 50 * (1 - 0.5)) = worldY - 25
            // worldX adjusted: worldX - (0 + 100 * (1 - 0.5)) = worldX - 50
            var worldX = 128 + 50;
            var worldY = 32 + 25;

            var result = IsometricWorldToTileXY(worldX, worldY, false, null, camera, layerWithTilemapLayer, true);

            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(0);
        });

        it('should scale tile dimensions by tilemapLayer scale', function ()
        {
            layerWithTilemapLayer.tilemapLayer.scaleX = 2;
            layerWithTilemapLayer.tilemapLayer.scaleY = 2;

            // tileWidth becomes 256, tileHeight becomes 128
            // tileWidthHalf=128, tileHeightHalf=64
            // For tile (1,0): adjX=128, worldY=64
            // x = 0.5 * (128/128 + 64/64) = 0.5 * (1 + 1) = 1
            // y = 0.5 * (-128/128 + 64/64) = 0.5 * (-1 + 1) = 0
            var result = IsometricWorldToTileXY(256, 64, false, null, camera, layerWithTilemapLayer, true);

            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(0);
        });

        it('should handle scrollFactorY of 1 (no parallax adjustment)', function ()
        {
            camera.scrollY = 200;
            layerWithTilemapLayer.tilemapLayer.scrollFactorY = 1;

            // scrollFactor=1: worldY adjusted by worldY - (0 + 200*(1-1)) = worldY - 0
            var result = IsometricWorldToTileXY(128, 32, false, null, camera, layerWithTilemapLayer, true);

            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(0);
        });
    });
});
