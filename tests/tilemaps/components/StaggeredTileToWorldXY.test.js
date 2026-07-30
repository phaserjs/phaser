var StaggeredTileToWorldXY = require('../../../src/tilemaps/components/StaggeredTileToWorldXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.StaggeredTileToWorldXY', function ()
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
            var result = StaggeredTileToWorldXY(0, 0, null, null, layer);
            expect(result).toBeInstanceOf(Vector2);
        });

        it('should return the provided point object', function ()
        {
            var point = new Vector2();
            var result = StaggeredTileToWorldXY(0, 0, point, null, layer);
            expect(result).toBe(point);
        });

        it('should create a new Vector2 when point is null', function ()
        {
            var result = StaggeredTileToWorldXY(0, 0, null, null, layer);
            expect(result).toBeInstanceOf(Vector2);
        });

        it('should create a new Vector2 when point is undefined', function ()
        {
            var result = StaggeredTileToWorldXY(0, 0, undefined, null, layer);
            expect(result).toBeInstanceOf(Vector2);
        });
    });

    describe('without tilemapLayer (no layer offset or scale)', function ()
    {
        it('should return world origin for tile (0, 0)', function ()
        {
            var result = StaggeredTileToWorldXY(0, 0, null, null, layer);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should calculate correct x for even tileY (no stagger offset)', function ()
        {
            // tileY % 2 === 0, so no stagger offset on x
            var result = StaggeredTileToWorldXY(2, 0, null, null, layer);
            expect(result.x).toBe(64); // 2 * 32
            expect(result.y).toBe(0);
        });

        it('should calculate correct x for odd tileY (with stagger offset)', function ()
        {
            // tileY % 2 === 1, so stagger offset = tileWidth / 2 = 16
            var result = StaggeredTileToWorldXY(2, 1, null, null, layer);
            expect(result.x).toBe(80); // 2 * 32 + 16
            expect(result.y).toBe(16); // 1 * (32 / 2)
        });

        it('should calculate correct y position', function ()
        {
            var result = StaggeredTileToWorldXY(0, 4, null, null, layer);
            expect(result.x).toBe(0);
            expect(result.y).toBe(64); // 4 * (32 / 2)
        });

        it('should apply stagger offset on odd row y=1', function ()
        {
            var result = StaggeredTileToWorldXY(0, 1, null, null, layer);
            expect(result.x).toBe(16); // 0 * 32 + 1 % 2 * 16
            expect(result.y).toBe(16); // 1 * 16
        });

        it('should apply stagger offset on odd row y=3', function ()
        {
            var result = StaggeredTileToWorldXY(1, 3, null, null, layer);
            expect(result.x).toBe(48); // 1 * 32 + 16
            expect(result.y).toBe(48); // 3 * 16
        });

        it('should not apply stagger offset on even row y=2', function ()
        {
            var result = StaggeredTileToWorldXY(1, 2, null, null, layer);
            expect(result.x).toBe(32); // 1 * 32 + 0
            expect(result.y).toBe(32); // 2 * 16
        });

        it('should handle non-square tiles', function ()
        {
            layer.baseTileWidth = 64;
            layer.baseTileHeight = 32;

            var result = StaggeredTileToWorldXY(2, 1, null, null, layer);
            expect(result.x).toBe(160); // 2 * 64 + 1 % 2 * 32
            expect(result.y).toBe(16);  // 1 * (32 / 2)
        });

        it('should handle zero tile coordinates', function ()
        {
            var result = StaggeredTileToWorldXY(0, 0, null, null, layer);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should update the provided point x and y values', function ()
        {
            var point = new Vector2(999, 999);
            StaggeredTileToWorldXY(1, 2, point, null, layer);
            expect(point.x).toBe(32);
            expect(point.y).toBe(32);
        });
    });

    describe('with tilemapLayer (with layer offset and scale)', function ()
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

        it('should return origin for tile (0, 0) with no offset or scroll', function ()
        {
            var result = StaggeredTileToWorldXY(0, 0, null, camera, layer);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should apply layer position offset', function ()
        {
            tilemapLayer.x = 100;
            tilemapLayer.y = 50;

            var result = StaggeredTileToWorldXY(0, 0, null, camera, layer);
            expect(result.x).toBe(100);
            expect(result.y).toBe(50);
        });

        it('should apply camera scroll with default scrollFactor of 1', function ()
        {
            camera.scrollX = 10;
            camera.scrollY = 20;
            tilemapLayer.scrollFactorX = 1;
            tilemapLayer.scrollFactorY = 1;

            // scrollX * (1 - scrollFactorX) = 10 * 0 = 0
            var result = StaggeredTileToWorldXY(0, 0, null, camera, layer);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should apply camera scroll with scrollFactor of 0', function ()
        {
            camera.scrollX = 10;
            camera.scrollY = 20;
            tilemapLayer.scrollFactorX = 0;
            tilemapLayer.scrollFactorY = 0;

            // layerWorldX = 0 + 10 * (1 - 0) = 10
            // layerWorldY = 0 + 20 * (1 - 0) = 20
            var result = StaggeredTileToWorldXY(0, 0, null, camera, layer);
            expect(result.x).toBe(10);
            expect(result.y).toBe(20);
        });

        it('should apply layer scale to tile dimensions', function ()
        {
            tilemapLayer.scaleX = 2;
            tilemapLayer.scaleY = 2;

            // tileWidth = 32 * 2 = 64, tileHeight = 32 * 2 = 64
            var result = StaggeredTileToWorldXY(1, 0, null, camera, layer);
            expect(result.x).toBe(64); // 1 * 64
            expect(result.y).toBe(0);
        });

        it('should apply scale and stagger offset on odd row', function ()
        {
            tilemapLayer.scaleX = 2;
            tilemapLayer.scaleY = 2;

            // tileWidth = 64, tileHeight = 64
            // x = 1 * 64 + 1 % 2 * 32 = 96
            // y = 1 * 32
            var result = StaggeredTileToWorldXY(1, 1, null, camera, layer);
            expect(result.x).toBe(96);
            expect(result.y).toBe(32);
        });

        it('should use scene main camera when no camera is provided', function ()
        {
            tilemapLayer.x = 0;
            tilemapLayer.y = 0;
            tilemapLayer.scrollFactorX = 0;
            tilemapLayer.scrollFactorY = 0;
            camera.scrollX = 5;
            camera.scrollY = 10;

            // no camera passed, should use tilemapLayer.scene.cameras.main
            // layerWorldX = 0 + 5 * (1 - 0) = 5
            // layerWorldY = 0 + 10 * (1 - 0) = 10
            var result = StaggeredTileToWorldXY(0, 0, null, null, layer);
            expect(result.x).toBe(5);
            expect(result.y).toBe(10);
        });

        it('should combine layer offset, camera scroll, scale, and tile position', function ()
        {
            tilemapLayer.x = 10;
            tilemapLayer.y = 20;
            tilemapLayer.scaleX = 2;
            tilemapLayer.scaleY = 2;
            tilemapLayer.scrollFactorX = 0.5;
            tilemapLayer.scrollFactorY = 0.5;
            camera.scrollX = 40;
            camera.scrollY = 60;

            // layerWorldX = 10 + 40 * (1 - 0.5) = 10 + 20 = 30
            // layerWorldY = 20 + 60 * (1 - 0.5) = 20 + 30 = 50
            // tileWidth = 32 * 2 = 64, tileHeight = 32 * 2 = 64
            // tile (1, 2): x = 30 + 1*64 + 0*(32) = 94, y = 50 + 2*32 = 114
            var result = StaggeredTileToWorldXY(1, 2, null, camera, layer);
            expect(result.x).toBe(94);
            expect(result.y).toBe(114);
        });
    });

    describe('stagger pattern correctness', function ()
    {
        it('should have larger x for odd rows than even rows at same tileX', function ()
        {
            var evenRow = StaggeredTileToWorldXY(1, 0, null, null, layer);
            var oddRow = StaggeredTileToWorldXY(1, 1, null, null, layer);
            expect(oddRow.x).toBe(evenRow.x + layer.baseTileWidth / 2);
        });

        it('should produce same x stagger for all odd row indices', function ()
        {
            var row1 = StaggeredTileToWorldXY(0, 1, null, null, layer);
            var row3 = StaggeredTileToWorldXY(0, 3, null, null, layer);
            var row5 = StaggeredTileToWorldXY(0, 5, null, null, layer);

            // All odd rows should have the half-tile stagger offset
            expect(row1.x).toBe(16);
            expect(row3.x).toBe(16);
            expect(row5.x).toBe(16);
        });

        it('should produce zero x stagger for all even row indices', function ()
        {
            var row0 = StaggeredTileToWorldXY(0, 0, null, null, layer);
            var row2 = StaggeredTileToWorldXY(0, 2, null, null, layer);
            var row4 = StaggeredTileToWorldXY(0, 4, null, null, layer);

            expect(row0.x).toBe(0);
            expect(row2.x).toBe(0);
            expect(row4.x).toBe(0);
        });

        it('should increment y by half tile height per row', function ()
        {
            var row0 = StaggeredTileToWorldXY(0, 0, null, null, layer);
            var row1 = StaggeredTileToWorldXY(0, 1, null, null, layer);
            var row2 = StaggeredTileToWorldXY(0, 2, null, null, layer);

            expect(row0.y).toBe(0);
            expect(row1.y).toBe(16);
            expect(row2.y).toBe(32);
        });
    });
});
