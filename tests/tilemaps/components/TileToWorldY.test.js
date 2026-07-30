var TileToWorldY = require('../../../src/tilemaps/components/TileToWorldY');

describe('Phaser.Tilemaps.Components.TileToWorldY', function ()
{
    var layer;
    var camera;

    beforeEach(function ()
    {
        layer = {
            baseTileHeight: 32,
            tilemapLayer: null
        };

        camera = {
            scrollY: 0
        };
    });

    it('should return zero when tileY is zero and no tilemapLayer', function ()
    {
        expect(TileToWorldY(0, camera, layer)).toBe(0);
    });

    it('should return tileY multiplied by baseTileHeight when no tilemapLayer', function ()
    {
        expect(TileToWorldY(3, camera, layer)).toBe(96);
    });

    it('should return correct value for negative tileY when no tilemapLayer', function ()
    {
        expect(TileToWorldY(-2, camera, layer)).toBe(-64);
    });

    it('should return correct value for floating point tileY when no tilemapLayer', function ()
    {
        expect(TileToWorldY(1.5, camera, layer)).toBeCloseTo(48);
    });

    it('should use baseTileHeight from layer when no tilemapLayer', function ()
    {
        layer.baseTileHeight = 16;
        expect(TileToWorldY(4, camera, layer)).toBe(64);
    });

    it('should factor in tilemapLayer y position', function ()
    {
        layer.tilemapLayer = {
            y: 100,
            scrollFactorY: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        expect(TileToWorldY(0, camera, layer)).toBe(100);
    });

    it('should factor in tilemapLayer y and tileY', function ()
    {
        layer.tilemapLayer = {
            y: 50,
            scrollFactorY: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        expect(TileToWorldY(2, camera, layer)).toBe(50 + 2 * 32);
    });

    it('should factor in camera scrollY with scrollFactorY of 1', function ()
    {
        camera.scrollY = 200;
        layer.tilemapLayer = {
            y: 0,
            scrollFactorY: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        // layerWorldY = 0 + 200 * (1 - 1) = 0
        expect(TileToWorldY(0, camera, layer)).toBe(0);
    });

    it('should factor in camera scrollY with scrollFactorY of 0', function ()
    {
        camera.scrollY = 200;
        layer.tilemapLayer = {
            y: 0,
            scrollFactorY: 0,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        // layerWorldY = 0 + 200 * (1 - 0) = 200
        expect(TileToWorldY(0, camera, layer)).toBe(200);
    });

    it('should factor in camera scrollY with scrollFactorY of 0.5', function ()
    {
        camera.scrollY = 100;
        layer.tilemapLayer = {
            y: 0,
            scrollFactorY: 0.5,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        // layerWorldY = 0 + 100 * (1 - 0.5) = 50
        expect(TileToWorldY(0, camera, layer)).toBeCloseTo(50);
    });

    it('should factor in tilemapLayer scaleY', function ()
    {
        layer.tilemapLayer = {
            y: 0,
            scrollFactorY: 1,
            scaleY: 2,
            scene: { cameras: { main: camera } }
        };

        // tileHeight = 32 * 2 = 64
        expect(TileToWorldY(3, camera, layer)).toBe(192);
    });

    it('should combine tilemapLayer y, scrollY, scaleY and tileY', function ()
    {
        camera.scrollY = 50;
        layer.tilemapLayer = {
            y: 20,
            scrollFactorY: 0,
            scaleY: 2,
            scene: { cameras: { main: camera } }
        };

        // layerWorldY = 20 + 50 * (1 - 0) = 70
        // tileHeight = 32 * 2 = 64
        // result = 70 + 2 * 64 = 198
        expect(TileToWorldY(2, camera, layer)).toBe(198);
    });

    it('should use scene main camera when camera is null and tilemapLayer is present', function ()
    {
        var mainCamera = { scrollY: 0 };
        layer.tilemapLayer = {
            y: 0,
            scrollFactorY: 1,
            scaleY: 1,
            scene: { cameras: { main: mainCamera } }
        };

        expect(TileToWorldY(3, null, layer)).toBe(96);
    });

    it('should use scene main camera scrollY when camera is null', function ()
    {
        var mainCamera = { scrollY: 100 };
        layer.tilemapLayer = {
            y: 0,
            scrollFactorY: 0,
            scaleY: 1,
            scene: { cameras: { main: mainCamera } }
        };

        // layerWorldY = 0 + 100 * (1 - 0) = 100
        expect(TileToWorldY(0, null, layer)).toBe(100);
    });

    it('should return correct value for large tileY', function ()
    {
        expect(TileToWorldY(1000, camera, layer)).toBe(32000);
    });

    it('should return zero for tileY zero with baseTileHeight zero', function ()
    {
        layer.baseTileHeight = 0;
        expect(TileToWorldY(5, camera, layer)).toBe(0);
    });

    it('should handle negative tilemapLayer y position', function ()
    {
        layer.tilemapLayer = {
            y: -64,
            scrollFactorY: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        expect(TileToWorldY(2, camera, layer)).toBe(-64 + 64);
    });

    it('should handle negative camera scrollY', function ()
    {
        camera.scrollY = -100;
        layer.tilemapLayer = {
            y: 0,
            scrollFactorY: 0,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        // layerWorldY = 0 + (-100) * (1 - 0) = -100
        expect(TileToWorldY(0, camera, layer)).toBe(-100);
    });
});
