var GetTileCorners = require('../../../src/tilemaps/components/GetTileCorners');

describe('Phaser.Tilemaps.Components.GetTileCorners', function ()
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

    it('should return an array of four Vector2 objects', function ()
    {
        var corners = GetTileCorners(0, 0, camera, layer);

        expect(Array.isArray(corners)).toBe(true);
        expect(corners.length).toBe(4);
    });

    it('should return Vector2 objects with x and y properties', function ()
    {
        var corners = GetTileCorners(0, 0, camera, layer);

        corners.forEach(function (corner)
        {
            expect(typeof corner.x).toBe('number');
            expect(typeof corner.y).toBe('number');
        });
    });

    it('should return correct corners for tile at origin with no tilemapLayer', function ()
    {
        var corners = GetTileCorners(0, 0, camera, layer);

        // Top Left
        expect(corners[0].x).toBe(0);
        expect(corners[0].y).toBe(0);
        // Top Right
        expect(corners[1].x).toBe(32);
        expect(corners[1].y).toBe(0);
        // Bottom Right
        expect(corners[2].x).toBe(32);
        expect(corners[2].y).toBe(32);
        // Bottom Left
        expect(corners[3].x).toBe(0);
        expect(corners[3].y).toBe(32);
    });

    it('should return corners in order: top-left, top-right, bottom-right, bottom-left', function ()
    {
        var corners = GetTileCorners(1, 1, camera, layer);

        var topLeft = corners[0];
        var topRight = corners[1];
        var bottomRight = corners[2];
        var bottomLeft = corners[3];

        expect(topLeft.x).toBe(topLeft.x);
        expect(topRight.x).toBeGreaterThan(topLeft.x);
        expect(bottomRight.x).toBe(topRight.x);
        expect(bottomLeft.x).toBe(topLeft.x);

        expect(topLeft.y).toBe(topRight.y);
        expect(bottomLeft.y).toBe(bottomRight.y);
        expect(bottomLeft.y).toBeGreaterThan(topLeft.y);
    });

    it('should offset corners by tileX and tileY', function ()
    {
        var tileX = 3;
        var tileY = 5;
        var corners = GetTileCorners(tileX, tileY, camera, layer);

        var expectedX = tileX * 32;
        var expectedY = tileY * 32;

        expect(corners[0].x).toBe(expectedX);
        expect(corners[0].y).toBe(expectedY);
        expect(corners[1].x).toBe(expectedX + 32);
        expect(corners[1].y).toBe(expectedY);
        expect(corners[2].x).toBe(expectedX + 32);
        expect(corners[2].y).toBe(expectedY + 32);
        expect(corners[3].x).toBe(expectedX);
        expect(corners[3].y).toBe(expectedY + 32);
    });

    it('should use baseTileWidth and baseTileHeight from layer', function ()
    {
        layer.baseTileWidth = 64;
        layer.baseTileHeight = 48;

        var corners = GetTileCorners(0, 0, camera, layer);

        expect(corners[1].x).toBe(64);
        expect(corners[2].x).toBe(64);
        expect(corners[2].y).toBe(48);
        expect(corners[3].y).toBe(48);
    });

    it('should handle non-square tiles', function ()
    {
        layer.baseTileWidth = 16;
        layer.baseTileHeight = 32;

        var corners = GetTileCorners(1, 1, camera, layer);

        expect(corners[0].x).toBe(16);
        expect(corners[0].y).toBe(32);
        expect(corners[1].x).toBe(32);
        expect(corners[1].y).toBe(32);
        expect(corners[2].x).toBe(32);
        expect(corners[2].y).toBe(64);
        expect(corners[3].x).toBe(16);
        expect(corners[3].y).toBe(64);
    });

    it('should handle tileX = 0 and tileY = 0', function ()
    {
        var corners = GetTileCorners(0, 0, camera, layer);

        expect(corners[0].x).toBe(0);
        expect(corners[0].y).toBe(0);
    });

    it('should handle negative tile coordinates', function ()
    {
        var corners = GetTileCorners(-1, -2, camera, layer);

        expect(corners[0].x).toBe(-32);
        expect(corners[0].y).toBe(-64);
        expect(corners[2].x).toBe(0);
        expect(corners[2].y).toBe(-32);
    });

    it('should account for tilemapLayer world position', function ()
    {
        layer.tilemapLayer = {
            x: 100,
            y: 200,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        var corners = GetTileCorners(0, 0, camera, layer);

        expect(corners[0].x).toBe(100);
        expect(corners[0].y).toBe(200);
    });

    it('should account for camera scroll when tilemapLayer is present', function ()
    {
        camera.scrollX = 50;
        camera.scrollY = 75;

        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scrollFactorX: 0,
            scrollFactorY: 0,
            scaleX: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        var corners = GetTileCorners(0, 0, camera, layer);

        // scrollFactor 0 means camera scroll has full effect: worldX = 0 + 50 * (1 - 0) = 50
        expect(corners[0].x).toBe(50);
        expect(corners[0].y).toBe(75);
    });

    it('should apply scrollFactor to camera scroll offset', function ()
    {
        camera.scrollX = 100;
        camera.scrollY = 100;

        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scrollFactorX: 0.5,
            scrollFactorY: 0.5,
            scaleX: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        var corners = GetTileCorners(0, 0, camera, layer);

        // worldX = 0 + 100 * (1 - 0.5) = 50
        expect(corners[0].x).toBe(50);
        expect(corners[0].y).toBe(50);
    });

    it('should apply tilemapLayer scale to tile dimensions', function ()
    {
        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 2,
            scaleY: 3,
            scene: { cameras: { main: camera } }
        };

        var corners = GetTileCorners(0, 0, camera, layer);

        var scaledWidth = 32 * 2;
        var scaledHeight = 32 * 3;

        expect(corners[1].x).toBe(scaledWidth);
        expect(corners[2].y).toBe(scaledHeight);
    });

    it('should use scene main camera when camera is null and tilemapLayer is present', function ()
    {
        var mainCamera = {
            scrollX: 0,
            scrollY: 0
        };

        layer.tilemapLayer = {
            x: 10,
            y: 20,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 1,
            scene: { cameras: { main: mainCamera } }
        };

        var corners = GetTileCorners(0, 0, null, layer);

        expect(corners[0].x).toBe(10);
        expect(corners[0].y).toBe(20);
    });

    it('should combine tilemapLayer position with tile offset', function ()
    {
        layer.tilemapLayer = {
            x: 10,
            y: 20,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        var corners = GetTileCorners(2, 3, camera, layer);

        // worldX = 10 + 0 * (1 - 1) = 10, x = 10 + 2 * 32 = 74
        // worldY = 20 + 0 * (1 - 1) = 20, y = 20 + 3 * 32 = 116
        expect(corners[0].x).toBe(74);
        expect(corners[0].y).toBe(116);
    });

    it('should return worldX = 0 and worldY = 0 when no tilemapLayer', function ()
    {
        var corners = GetTileCorners(1, 1, camera, layer);

        expect(corners[0].x).toBe(32);
        expect(corners[0].y).toBe(32);
    });
});
