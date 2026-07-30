var HasTileAtWorldXY = require('../../../src/tilemaps/components/HasTileAtWorldXY');

describe('Phaser.Tilemaps.Components.HasTileAtWorldXY', function ()
{
    var layer;

    function makeTile(index)
    {
        return { index: index };
    }

    function makeLayer(data)
    {
        return {
            data: data,
            width: data[0].length,
            height: data.length,
            tilemapLayer: {
                worldToTileXY: function (worldX, worldY, snap, point, camera)
                {
                    point.x = Math.floor(worldX / 32);
                    point.y = Math.floor(worldY / 32);
                }
            }
        };
    }

    beforeEach(function ()
    {
        layer = makeLayer([
            [ makeTile(1),  makeTile(2),  makeTile(-1) ],
            [ makeTile(0),  null,          makeTile(5)  ],
            [ makeTile(-1), makeTile(3),  makeTile(4)  ]
        ]);
    });

    it('should return true when a valid tile exists at the world coordinate', function ()
    {
        // worldX=0, worldY=0 -> tileX=0, tileY=0 -> tile.index=1
        expect(HasTileAtWorldXY(0, 0, null, layer)).toBe(true);
    });

    it('should return true when tile index is 0', function ()
    {
        // worldX=0, worldY=32 -> tileX=0, tileY=1 -> tile.index=0
        expect(HasTileAtWorldXY(0, 32, null, layer)).toBe(true);
    });

    it('should return false when tile index is -1', function ()
    {
        // worldX=64, worldY=0 -> tileX=2, tileY=0 -> tile.index=-1
        expect(HasTileAtWorldXY(64, 0, null, layer)).toBe(false);
    });

    it('should return false when tile is null', function ()
    {
        // worldX=32, worldY=32 -> tileX=1, tileY=1 -> tile=null
        expect(HasTileAtWorldXY(32, 32, null, layer)).toBe(false);
    });

    it('should return false when world coordinates map outside layer bounds', function ()
    {
        // worldX=320, worldY=320 -> tileX=10, tileY=10 -> out of bounds
        expect(HasTileAtWorldXY(320, 320, null, layer)).toBe(false);
    });

    it('should return false for negative world coordinates that map outside layer bounds', function ()
    {
        // worldX=-64, worldY=-64 -> tileX=-2, tileY=-2 -> out of bounds
        expect(HasTileAtWorldXY(-64, -64, null, layer)).toBe(false);
    });

    it('should return true for a tile with a large positive index', function ()
    {
        // worldX=64, worldY=64 -> tileX=2, tileY=2 -> tile.index=4
        expect(HasTileAtWorldXY(64, 64, null, layer)).toBe(true);
    });

    it('should pass the camera argument to worldToTileXY', function ()
    {
        var cameraPassedIn = null;
        var sentCamera = { name: 'testCamera' };
        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point, camera)
        {
            cameraPassedIn = camera;
            point.x = 0;
            point.y = 0;
        };

        HasTileAtWorldXY(0, 0, sentCamera, layer);

        expect(cameraPassedIn).toBe(sentCamera);
    });

    it('should use the tile coordinates returned by worldToTileXY', function ()
    {
        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point, camera)
        {
            point.x = 1;
            point.y = 2;
        };

        // tileX=1, tileY=2 -> tile.index=3
        expect(HasTileAtWorldXY(999, 999, null, layer)).toBe(true);
    });

    it('should return false when worldToTileXY maps to a tile with index -1 at row 2', function ()
    {
        layer.tilemapLayer.worldToTileXY = function (worldX, worldY, snap, point, camera)
        {
            point.x = 0;
            point.y = 2;
        };

        // tileX=0, tileY=2 -> tile.index=-1
        expect(HasTileAtWorldXY(0, 64, null, layer)).toBe(false);
    });
});
