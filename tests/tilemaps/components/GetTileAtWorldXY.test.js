var GetTileAtWorldXY = require('../../../src/tilemaps/components/GetTileAtWorldXY');

describe('Phaser.Tilemaps.Components.GetTileAtWorldXY', function ()
{
    var mockCamera;
    var mockLayer;
    var tileA;
    var tileEmpty;

    beforeEach(function ()
    {
        mockCamera = {};

        tileA = { index: 1 };
        tileEmpty = { index: -1 };

        // Layer with a 4x4 grid of tiles.
        // worldToTileXY maps world coords by dividing by 32.
        mockLayer = {
            width: 4,
            height: 4,
            data: [
                [ tileA,    tileA,    tileA,    tileA    ],
                [ tileA,    tileA,    tileA,    tileA    ],
                [ tileA,    tileEmpty, tileA,   tileA    ],
                [ tileA,    tileA,    tileA,    tileA    ]
            ],
            tilemapLayer: {
                worldToTileXY: vi.fn(function (worldX, worldY, snapToFloor, point, camera)
                {
                    point.x = Math.floor(worldX / 32);
                    point.y = Math.floor(worldY / 32);
                })
            }
        };
    });

    it('should call worldToTileXY with the given world coordinates', function ()
    {
        GetTileAtWorldXY(64, 96, false, mockCamera, mockLayer);

        expect(mockLayer.tilemapLayer.worldToTileXY).toHaveBeenCalledWith(
            64, 96, true, expect.any(Object), mockCamera
        );
    });

    it('should always pass snapToFloor as true to worldToTileXY', function ()
    {
        GetTileAtWorldXY(32, 64, false, mockCamera, mockLayer);

        var call = mockLayer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[2]).toBe(true);
    });

    it('should pass the camera object to worldToTileXY', function ()
    {
        var specificCamera = { scrollX: 100 };
        mockLayer.tilemapLayer.worldToTileXY = vi.fn(function (worldX, worldY, snap, point, camera)
        {
            point.x = 0;
            point.y = 0;
        });

        GetTileAtWorldXY(0, 0, false, specificCamera, mockLayer);

        var call = mockLayer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[4]).toBe(specificCamera);
    });

    it('should return the tile at the converted tile coordinates', function ()
    {
        // world (32, 0) -> tile (1, 0) -> tileA
        var result = GetTileAtWorldXY(32, 0, false, mockCamera, mockLayer);

        expect(result).toBe(tileA);
    });

    it('should return null when the tile has index -1 and nonNull is false', function ()
    {
        // world (32, 64) -> tile (1, 2) -> tileEmpty (index: -1)
        var result = GetTileAtWorldXY(32, 64, false, mockCamera, mockLayer);

        expect(result).toBeNull();
    });

    it('should return the empty tile when tile index is -1 and nonNull is true', function ()
    {
        // world (32, 64) -> tile (1, 2) -> tileEmpty (index: -1)
        var result = GetTileAtWorldXY(32, 64, true, mockCamera, mockLayer);

        expect(result).toBe(tileEmpty);
    });

    it('should return null when world coordinates map outside layer bounds', function ()
    {
        // world (200, 200) -> tile (6, 6) -> out of 4x4 bounds
        var result = GetTileAtWorldXY(200, 200, false, mockCamera, mockLayer);

        expect(result).toBeNull();
    });

    it('should return null for negative world coordinates that map to negative tile coords', function ()
    {
        // world (-32, -32) -> tile (-1, -1) -> out of bounds
        var result = GetTileAtWorldXY(-32, -32, false, mockCamera, mockLayer);

        expect(result).toBeNull();
    });

    it('should work with zero world coordinates mapping to tile (0,0)', function ()
    {
        mockLayer.data[0][0] = tileA;

        var result = GetTileAtWorldXY(0, 0, false, mockCamera, mockLayer);

        expect(result).toBe(tileA);
    });

    it('should use the converted point coordinates when calling GetTileAt', function ()
    {
        // Override worldToTileXY to set a specific tile position
        mockLayer.tilemapLayer.worldToTileXY = vi.fn(function (worldX, worldY, snap, point, camera)
        {
            point.x = 3;
            point.y = 3;
        });

        var cornerTile = { index: 5 };
        mockLayer.data[3][3] = cornerTile;

        var result = GetTileAtWorldXY(999, 999, false, mockCamera, mockLayer);

        expect(result).toBe(cornerTile);
    });

    it('should return null when the tile at converted coordinates is null/falsy', function ()
    {
        mockLayer.tilemapLayer.worldToTileXY = vi.fn(function (worldX, worldY, snap, point, camera)
        {
            point.x = 2;
            point.y = 2;
        });

        mockLayer.data[2][2] = null;

        var result = GetTileAtWorldXY(64, 64, false, mockCamera, mockLayer);

        expect(result).toBeNull();
    });

    it('should return null when nonNull is false even if tile exists at boundary', function ()
    {
        mockLayer.tilemapLayer.worldToTileXY = vi.fn(function (worldX, worldY, snap, point, camera)
        {
            // Just outside the right/bottom edge
            point.x = 4;
            point.y = 4;
        });

        var result = GetTileAtWorldXY(128, 128, false, mockCamera, mockLayer);

        expect(result).toBeNull();
    });

    it('should pass the layer to worldToTileXY via the point reference and use it in lookup', function ()
    {
        var capturedPoint;

        mockLayer.tilemapLayer.worldToTileXY = vi.fn(function (worldX, worldY, snap, point, camera)
        {
            capturedPoint = point;
            point.x = 0;
            point.y = 1;
        });

        mockLayer.data[1][0] = tileA;

        var result = GetTileAtWorldXY(0, 32, false, mockCamera, mockLayer);

        expect(capturedPoint).toBeDefined();
        expect(capturedPoint.x).toBe(0);
        expect(capturedPoint.y).toBe(1);
        expect(result).toBe(tileA);
    });
});
