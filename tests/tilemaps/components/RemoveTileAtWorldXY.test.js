var RemoveTileAtWorldXY = require('../../../src/tilemaps/components/RemoveTileAtWorldXY');

describe('Phaser.Tilemaps.Components.RemoveTileAtWorldXY', function ()
{
    var layer;
    var camera;
    var fakeTile;

    beforeEach(function ()
    {
        fakeTile = { index: -1, x: 2, y: 3 };

        layer = {
            tilemapLayer: {
                worldToTileXY: function (worldX, worldY, snap, point, cam, lyr)
                {
                    point.x = 2;
                    point.y = 3;
                }
            },
            data: [],
            width: 10,
            height: 10
        };

        camera = {};
    });

    it('should be importable', function ()
    {
        expect(typeof RemoveTileAtWorldXY).toBe('function');
    });

    it('should call worldToTileXY on the layer tilemapLayer', function ()
    {
        var called = false;
        var capturedArgs = {};

        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point, cam, lyr)
        {
            called = true;
            capturedArgs.worldX = worldX;
            capturedArgs.worldY = worldY;
            capturedArgs.snap = snap;
            capturedArgs.camera = cam;
            capturedArgs.layer = lyr;
            point.x = 0;
            point.y = 0;
        };

        // Build minimal layer data so RemoveTileAt doesn't throw
        layer.data = [ [ { index: 1 } ] ];
        layer.width = 1;
        layer.height = 1;

        RemoveTileAtWorldXY(100, 200, true, false, camera, layer);

        expect(called).toBe(true);
        expect(capturedArgs.worldX).toBe(100);
        expect(capturedArgs.worldY).toBe(200);
        expect(capturedArgs.snap).toBe(true);
        expect(capturedArgs.camera).toBe(camera);
        expect(capturedArgs.layer).toBe(layer);
    });

    it('should pass replaceWithNull and recalculateFaces through to RemoveTileAt', function ()
    {
        var tile = { index: 5 };
        var row = [ tile ];

        layer.data = [ row ];
        layer.width = 1;
        layer.height = 1;
        layer.tileWidth = 32;
        layer.tileHeight = 32;

        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point)
        {
            point.x = 0;
            point.y = 0;
        };

        var result = RemoveTileAtWorldXY(0, 0, false, false, camera, layer);

        // RemoveTileAt returns the original removed tile; replaceWithNull = false means
        // the slot is replaced with a new Tile(-1) rather than null
        expect(result).not.toBeNull();
        expect(result.index).toBe(5);
        expect(layer.data[0][0].index).toBe(-1);
    });

    it('should set the data slot to null when replaceWithNull is true', function ()
    {
        var tile = { index: 5 };
        var row = [ tile ];

        layer.data = [ row ];
        layer.width = 1;
        layer.height = 1;

        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point)
        {
            point.x = 0;
            point.y = 0;
        };

        var result = RemoveTileAtWorldXY(0, 0, true, false, camera, layer);

        // The original tile is returned; the slot in the data array is set to null
        expect(result.index).toBe(5);
        expect(layer.data[0][0]).toBeNull();
    });

    it('should return null when the tile coordinates are out of bounds', function ()
    {
        layer.data = [ [ { index: 1 } ] ];
        layer.width = 1;
        layer.height = 1;

        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point)
        {
            point.x = 99;
            point.y = 99;
        };

        var result = RemoveTileAtWorldXY(9999, 9999, true, false, camera, layer);

        expect(result).toBeNull();
    });

    it('should use the tile coordinates resolved by worldToTileXY', function ()
    {
        var tileA = { index: 1 };
        var tileB = { index: 2 };

        layer.data = [ [ tileA, tileB ] ];
        layer.width = 2;
        layer.height = 1;

        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point)
        {
            // map to column 1 regardless of worldX/worldY
            point.x = 1;
            point.y = 0;
        };

        // replaceWithNull = true: the targeted slot becomes null, the other slot is untouched
        RemoveTileAtWorldXY(0, 0, true, false, camera, layer);

        expect(layer.data[0][1]).toBeNull();
        expect(layer.data[0][0]).toBe(tileA);
    });

    it('should accept any numeric world coordinates', function ()
    {
        layer.data = [ [ { index: 3 } ] ];
        layer.width = 1;
        layer.height = 1;

        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point)
        {
            point.x = 0;
            point.y = 0;
        };

        expect(function ()
        {
            RemoveTileAtWorldXY(-500, -500, true, false, camera, layer);
        }).not.toThrow();

        expect(function ()
        {
            RemoveTileAtWorldXY(0, 0, true, false, camera, layer);
        }).not.toThrow();

        expect(function ()
        {
            RemoveTileAtWorldXY(1e6, 1e6, true, false, camera, layer);
        }).not.toThrow();
    });
});
