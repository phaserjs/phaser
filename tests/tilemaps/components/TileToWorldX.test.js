var TileToWorldX = require('../../../src/tilemaps/components/TileToWorldX');

describe('Phaser.Tilemaps.Components.TileToWorldX', function ()
{
    var layer;

    beforeEach(function ()
    {
        layer = {
            baseTileWidth: 32,
            tilemapLayer: null
        };
    });

    it('should return zero when tileX is zero and no tilemapLayer', function ()
    {
        expect(TileToWorldX(0, null, layer)).toBe(0);
    });

    it('should return tileX multiplied by baseTileWidth when no tilemapLayer', function ()
    {
        expect(TileToWorldX(1, null, layer)).toBe(32);
        expect(TileToWorldX(5, null, layer)).toBe(160);
        expect(TileToWorldX(10, null, layer)).toBe(320);
    });

    it('should handle negative tileX with no tilemapLayer', function ()
    {
        expect(TileToWorldX(-1, null, layer)).toBe(-32);
        expect(TileToWorldX(-5, null, layer)).toBe(-160);
    });

    it('should handle floating point tileX with no tilemapLayer', function ()
    {
        expect(TileToWorldX(0.5, null, layer)).toBeCloseTo(16);
        expect(TileToWorldX(1.5, null, layer)).toBeCloseTo(48);
    });

    it('should use baseTileWidth from layer', function ()
    {
        layer.baseTileWidth = 64;
        expect(TileToWorldX(2, null, layer)).toBe(128);
    });

    it('should factor in tilemapLayer position with no scroll factor effect', function ()
    {
        layer.tilemapLayer = {
            x: 100,
            scrollFactorX: 1,
            scaleX: 1,
            scene: { cameras: { main: { scrollX: 0 } } }
        };

        expect(TileToWorldX(0, null, layer)).toBe(100);
        expect(TileToWorldX(1, null, layer)).toBe(132);
        expect(TileToWorldX(5, null, layer)).toBe(260);
    });

    it('should factor in camera scrollX when scrollFactorX is 0', function ()
    {
        var camera = { scrollX: 200 };

        layer.tilemapLayer = {
            x: 0,
            scrollFactorX: 0,
            scaleX: 1,
            scene: { cameras: { main: camera } }
        };

        // scrollFactorX=0 means layerWorldX = 0 + 200 * (1 - 0) = 200
        expect(TileToWorldX(0, camera, layer)).toBe(200);
        expect(TileToWorldX(1, camera, layer)).toBe(232);
    });

    it('should factor in camera scrollX when scrollFactorX is 1', function ()
    {
        var camera = { scrollX: 200 };

        layer.tilemapLayer = {
            x: 50,
            scrollFactorX: 1,
            scaleX: 1,
            scene: { cameras: { main: camera } }
        };

        // scrollFactorX=1 means layerWorldX = 50 + 200 * (1 - 1) = 50
        expect(TileToWorldX(0, camera, layer)).toBe(50);
        expect(TileToWorldX(1, camera, layer)).toBe(82);
    });

    it('should factor in camera scrollX with partial scrollFactorX', function ()
    {
        var camera = { scrollX: 100 };

        layer.tilemapLayer = {
            x: 0,
            scrollFactorX: 0.5,
            scaleX: 1,
            scene: { cameras: { main: camera } }
        };

        // layerWorldX = 0 + 100 * (1 - 0.5) = 50
        expect(TileToWorldX(0, camera, layer)).toBeCloseTo(50);
        expect(TileToWorldX(1, camera, layer)).toBeCloseTo(82);
    });

    it('should scale tileWidth by tilemapLayer scaleX', function ()
    {
        var camera = { scrollX: 0 };

        layer.tilemapLayer = {
            x: 0,
            scrollFactorX: 1,
            scaleX: 2,
            scene: { cameras: { main: camera } }
        };

        // tileWidth = 32 * 2 = 64
        expect(TileToWorldX(1, camera, layer)).toBe(64);
        expect(TileToWorldX(3, camera, layer)).toBe(192);
    });

    it('should use scene main camera when no camera is provided', function ()
    {
        var mainCamera = { scrollX: 50 };

        layer.tilemapLayer = {
            x: 10,
            scrollFactorX: 0,
            scaleX: 1,
            scene: { cameras: { main: mainCamera } }
        };

        // layerWorldX = 10 + 50 * (1 - 0) = 60
        expect(TileToWorldX(0, null, layer)).toBe(60);
        expect(TileToWorldX(2, null, layer)).toBe(124);
    });

    it('should combine layer x, scroll, scale, and tileX correctly', function ()
    {
        var camera = { scrollX: 100 };

        layer.baseTileWidth = 16;
        layer.tilemapLayer = {
            x: 50,
            scrollFactorX: 0.5,
            scaleX: 2,
            scene: { cameras: { main: camera } }
        };

        // layerWorldX = 50 + 100 * (1 - 0.5) = 100
        // tileWidth = 16 * 2 = 32
        // result = 100 + 3 * 32 = 196
        expect(TileToWorldX(3, camera, layer)).toBeCloseTo(196);
    });

    it('should return correct world X when tileX is zero with tilemapLayer', function ()
    {
        var camera = { scrollX: 0 };

        layer.tilemapLayer = {
            x: 200,
            scrollFactorX: 1,
            scaleX: 1,
            scene: { cameras: { main: camera } }
        };

        expect(TileToWorldX(0, camera, layer)).toBe(200);
    });

    it('should handle scaleX less than 1', function ()
    {
        var camera = { scrollX: 0 };

        layer.tilemapLayer = {
            x: 0,
            scrollFactorX: 1,
            scaleX: 0.5,
            scene: { cameras: { main: camera } }
        };

        // tileWidth = 32 * 0.5 = 16
        expect(TileToWorldX(4, camera, layer)).toBeCloseTo(64);
    });
});
