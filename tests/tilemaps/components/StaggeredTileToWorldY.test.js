var StaggeredTileToWorldY = require('../../../src/tilemaps/components/StaggeredTileToWorldY');

describe('Phaser.Tilemaps.Components.StaggeredTileToWorldY', function ()
{
    var camera;
    var layer;

    beforeEach(function ()
    {
        camera = { scrollY: 0 };
        layer = {
            baseTileHeight: 32,
            tilemapLayer: null
        };
    });

    describe('without tilemapLayer', function ()
    {
        it('should return tileHeight when tileY is zero', function ()
        {
            expect(StaggeredTileToWorldY(0, camera, layer)).toBe(32);
        });

        it('should return layerWorldY + tileY * (tileHeight / 2) + tileHeight for positive tileY', function ()
        {
            // layerWorldY = 0, tileHeight = 32
            // 0 + 1 * 16 + 32 = 48
            expect(StaggeredTileToWorldY(1, camera, layer)).toBe(48);
        });

        it('should return correct value for tileY = 2', function ()
        {
            // 0 + 2 * 16 + 32 = 64
            expect(StaggeredTileToWorldY(2, camera, layer)).toBe(64);
        });

        it('should return correct value for large tileY', function ()
        {
            // 0 + 10 * 16 + 32 = 192
            expect(StaggeredTileToWorldY(10, camera, layer)).toBe(192);
        });

        it('should return correct value for negative tileY', function ()
        {
            // 0 + (-1) * 16 + 32 = 16
            expect(StaggeredTileToWorldY(-1, camera, layer)).toBe(16);
        });

        it('should return correct value for negative tileY that results in negative world Y', function ()
        {
            // 0 + (-4) * 16 + 32 = -32
            expect(StaggeredTileToWorldY(-4, camera, layer)).toBe(-32);
        });

        it('should use baseTileHeight from layer', function ()
        {
            layer.baseTileHeight = 64;
            // 0 + 0 * 32 + 64 = 64
            expect(StaggeredTileToWorldY(0, camera, layer)).toBe(64);
        });

        it('should scale correctly with different tile heights', function ()
        {
            layer.baseTileHeight = 16;
            // 0 + 2 * 8 + 16 = 32
            expect(StaggeredTileToWorldY(2, camera, layer)).toBe(32);
        });

        it('should ignore camera when tilemapLayer is null', function ()
        {
            camera.scrollY = 100;
            // Camera scroll is ignored without tilemapLayer
            // 0 + 1 * 16 + 32 = 48
            expect(StaggeredTileToWorldY(1, camera, layer)).toBe(48);
        });

        it('should handle floating point tileY', function ()
        {
            // 0 + 0.5 * 16 + 32 = 40
            expect(StaggeredTileToWorldY(0.5, camera, layer)).toBeCloseTo(40);
        });
    });

    describe('with tilemapLayer', function ()
    {
        beforeEach(function ()
        {
            layer.tilemapLayer = {
                y: 0,
                scrollFactorY: 1,
                scaleY: 1,
                scene: {
                    cameras: {
                        main: { scrollY: 0 }
                    }
                }
            };
        });

        it('should return correct value with default layer settings', function ()
        {
            // layerWorldY = 0 + 0 * (1 - 1) = 0, tileHeight = 32 * 1 = 32
            // 0 + 1 * 16 + 32 = 48
            expect(StaggeredTileToWorldY(1, camera, layer)).toBe(48);
        });

        it('should factor in tilemapLayer y offset', function ()
        {
            layer.tilemapLayer.y = 100;
            // layerWorldY = 100 + 0 * 0 = 100
            // 100 + 1 * 16 + 32 = 148
            expect(StaggeredTileToWorldY(1, camera, layer)).toBe(148);
        });

        it('should factor in camera scrollY with scrollFactorY of 0', function ()
        {
            layer.tilemapLayer.scrollFactorY = 0;
            camera.scrollY = 50;
            // layerWorldY = 0 + 50 * (1 - 0) = 50
            // 50 + 1 * 16 + 32 = 98
            expect(StaggeredTileToWorldY(1, camera, layer)).toBe(98);
        });

        it('should factor in camera scrollY with scrollFactorY of 1 (no effect)', function ()
        {
            layer.tilemapLayer.scrollFactorY = 1;
            camera.scrollY = 50;
            // layerWorldY = 0 + 50 * (1 - 1) = 0
            // 0 + 1 * 16 + 32 = 48
            expect(StaggeredTileToWorldY(1, camera, layer)).toBe(48);
        });

        it('should factor in camera scrollY with scrollFactorY of 0.5', function ()
        {
            layer.tilemapLayer.scrollFactorY = 0.5;
            camera.scrollY = 100;
            // layerWorldY = 0 + 100 * 0.5 = 50
            // 50 + 2 * 16 + 32 = 114
            expect(StaggeredTileToWorldY(2, camera, layer)).toBe(114);
        });

        it('should apply scaleY to tileHeight', function ()
        {
            layer.tilemapLayer.scaleY = 2;
            // tileHeight = 32 * 2 = 64
            // layerWorldY = 0, 0 + 1 * 32 + 64 = 96
            expect(StaggeredTileToWorldY(1, camera, layer)).toBe(96);
        });

        it('should apply scaleY of 0.5 to tileHeight', function ()
        {
            layer.tilemapLayer.scaleY = 0.5;
            // tileHeight = 32 * 0.5 = 16
            // 0 + 1 * 8 + 16 = 24
            expect(StaggeredTileToWorldY(1, camera, layer)).toBe(24);
        });

        it('should combine layer y offset, scroll, and scale', function ()
        {
            layer.tilemapLayer.y = 50;
            layer.tilemapLayer.scrollFactorY = 0.5;
            layer.tilemapLayer.scaleY = 2;
            camera.scrollY = 40;
            // layerWorldY = 50 + 40 * 0.5 = 70
            // tileHeight = 32 * 2 = 64
            // 70 + 2 * 32 + 64 = 198
            expect(StaggeredTileToWorldY(2, camera, layer)).toBe(198);
        });

        it('should use scene cameras.main when camera is undefined', function ()
        {
            layer.tilemapLayer.scene.cameras.main.scrollY = 80;
            layer.tilemapLayer.scrollFactorY = 0;
            layer.tilemapLayer.y = 0;
            // layerWorldY = 0 + 80 * (1 - 0) = 80
            // 80 + 1 * 16 + 32 = 128
            expect(StaggeredTileToWorldY(1, undefined, layer)).toBe(128);
        });

        it('should return correct value when tileY is zero with tilemapLayer', function ()
        {
            // layerWorldY = 0, tileHeight = 32
            // 0 + 0 * 16 + 32 = 32
            expect(StaggeredTileToWorldY(0, camera, layer)).toBe(32);
        });

        it('should handle negative layer y offset', function ()
        {
            layer.tilemapLayer.y = -50;
            // layerWorldY = -50 + 0 * 0 = -50
            // -50 + 0 * 16 + 32 = -18
            expect(StaggeredTileToWorldY(0, camera, layer)).toBe(-18);
        });
    });
});
