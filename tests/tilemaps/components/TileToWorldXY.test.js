var TileToWorldXY = require('../../../src/tilemaps/components/TileToWorldXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.TileToWorldXY', function ()
{
    var layer;
    var camera;

    beforeEach(function ()
    {
        layer = {
            baseTileWidth: 32,
            baseTileHeight: 32,
            tilemapLayer: null
        };

        camera = {
            scrollX: 0,
            scrollY: 0
        };
    });

    it('should return a Vector2 instance', function ()
    {
        var result = TileToWorldXY(0, 0, null, camera, layer);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should create a new Vector2 when point is null', function ()
    {
        var result = TileToWorldXY(1, 2, null, camera, layer);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should create a new Vector2 when point is undefined', function ()
    {
        var result = TileToWorldXY(1, 2, undefined, camera, layer);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should update and return the provided point object', function ()
    {
        var point = new Vector2(0, 0);
        var result = TileToWorldXY(1, 2, point, camera, layer);

        expect(result).toBe(point);
    });

    it('should return world origin for tile (0, 0) with no tilemapLayer', function ()
    {
        var result = TileToWorldXY(0, 0, null, camera, layer);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should convert tile (1, 1) to world pixels with default 32px tile size', function ()
    {
        var result = TileToWorldXY(1, 1, null, camera, layer);

        expect(result.x).toBe(32);
        expect(result.y).toBe(32);
    });

    it('should convert tile (3, 4) to world pixels with default 32px tile size', function ()
    {
        var result = TileToWorldXY(3, 4, null, camera, layer);

        expect(result.x).toBe(96);
        expect(result.y).toBe(128);
    });

    it('should handle different baseTileWidth and baseTileHeight', function ()
    {
        layer.baseTileWidth = 16;
        layer.baseTileHeight = 24;

        var result = TileToWorldXY(2, 3, null, camera, layer);

        expect(result.x).toBe(32);
        expect(result.y).toBe(72);
    });

    it('should handle tile (0, 0) returning (0, 0) with no tilemapLayer', function ()
    {
        var point = new Vector2(99, 99);
        var result = TileToWorldXY(0, 0, point, camera, layer);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should handle fractional tile coordinates', function ()
    {
        var result = TileToWorldXY(0.5, 1.5, null, camera, layer);

        expect(result.x).toBeCloseTo(16);
        expect(result.y).toBeCloseTo(48);
    });

    it('should handle negative tile coordinates', function ()
    {
        var result = TileToWorldXY(-1, -2, null, camera, layer);

        expect(result.x).toBe(-32);
        expect(result.y).toBe(-64);
    });

    it('should factor in tilemapLayer position', function ()
    {
        layer.tilemapLayer = {
            x: 100,
            y: 200,
            scaleX: 1,
            scaleY: 1,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scene: { cameras: { main: camera } }
        };

        var result = TileToWorldXY(0, 0, null, camera, layer);

        expect(result.x).toBe(100);
        expect(result.y).toBe(200);
    });

    it('should factor in tilemapLayer scale', function ()
    {
        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scaleX: 2,
            scaleY: 3,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scene: { cameras: { main: camera } }
        };

        var result = TileToWorldXY(1, 1, null, camera, layer);

        expect(result.x).toBe(64);
        expect(result.y).toBe(96);
    });

    it('should factor in camera scroll when scrollFactor is 0', function ()
    {
        camera.scrollX = 50;
        camera.scrollY = 100;

        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            scrollFactorX: 0,
            scrollFactorY: 0,
            scene: { cameras: { main: camera } }
        };

        var result = TileToWorldXY(0, 0, null, camera, layer);

        // layerWorldX = 0 + 50 * (1 - 0) = 50
        // layerWorldY = 0 + 100 * (1 - 0) = 100
        expect(result.x).toBe(50);
        expect(result.y).toBe(100);
    });

    it('should factor in camera scroll with scrollFactor of 1 (no offset)', function ()
    {
        camera.scrollX = 50;
        camera.scrollY = 100;

        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scene: { cameras: { main: camera } }
        };

        var result = TileToWorldXY(0, 0, null, camera, layer);

        // layerWorldX = 0 + 50 * (1 - 1) = 0
        // layerWorldY = 0 + 100 * (1 - 1) = 0
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should use tilemapLayer scene camera when no camera is provided', function ()
    {
        var sceneCamera = { scrollX: 0, scrollY: 0 };

        layer.tilemapLayer = {
            x: 10,
            y: 20,
            scaleX: 1,
            scaleY: 1,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scene: { cameras: { main: sceneCamera } }
        };

        var result = TileToWorldXY(1, 1, null, null, layer);

        expect(result.x).toBe(42);
        expect(result.y).toBe(52);
    });

    it('should combine layer offset, scale, and tile position correctly', function ()
    {
        camera.scrollX = 0;
        camera.scrollY = 0;

        layer.baseTileWidth = 16;
        layer.baseTileHeight = 16;
        layer.tilemapLayer = {
            x: 64,
            y: 64,
            scaleX: 2,
            scaleY: 2,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scene: { cameras: { main: camera } }
        };

        var result = TileToWorldXY(3, 3, null, camera, layer);

        // tileWidth = 16 * 2 = 32, layerWorldX = 64
        // x = 64 + 3 * 32 = 160
        expect(result.x).toBe(160);
        expect(result.y).toBe(160);
    });

    it('should mutate the provided point x and y values', function ()
    {
        var point = new Vector2(999, 888);

        TileToWorldXY(2, 3, point, camera, layer);

        expect(point.x).toBe(64);
        expect(point.y).toBe(96);
    });
});
