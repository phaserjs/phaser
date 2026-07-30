var GetTilesWithinWorldXY = require('../../../src/tilemaps/components/GetTilesWithinWorldXY');

function createMockTile (index)
{
    return {
        index: index !== undefined ? index : 1,
        collides: false,
        hasInterestingFace: false
    };
}

function createMockLayerData (width, height)
{
    var data = [];

    for (var y = 0; y < height; y++)
    {
        data[y] = [];

        for (var x = 0; x < width; x++)
        {
            data[y][x] = createMockTile(1);
        }
    }

    return data;
}

describe('Phaser.Tilemaps.Components.GetTilesWithinWorldXY', function ()
{
    var mockLayer;
    var mockCamera;
    var mockFilteringOptions;
    var worldToTileXYSpy;

    beforeEach(function ()
    {
        worldToTileXYSpy = vi.fn(function (wx, wy, snap, point, camera, layer)
        {
            if (snap === true)
            {
                point.x = Math.floor(wx / 32);
                point.y = Math.floor(wy / 32);
            }
            else
            {
                point.x = wx / 32;
                point.y = wy / 32;
            }
        });

        mockLayer = {
            width: 20,
            height: 20,
            data: createMockLayerData(20, 20),
            tilemapLayer: {
                tilemap: {
                    _convert: {
                        WorldToTileXY: worldToTileXYSpy
                    }
                }
            }
        };

        mockCamera = {};
        mockFilteringOptions = {};
    });

    it('should call WorldToTileXY twice', function ()
    {
        GetTilesWithinWorldXY(0, 0, 64, 64, mockFilteringOptions, mockCamera, mockLayer);

        expect(worldToTileXYSpy).toHaveBeenCalledTimes(2);
    });

    it('should call WorldToTileXY first with snap=true for top-left corner', function ()
    {
        GetTilesWithinWorldXY(32, 64, 64, 64, mockFilteringOptions, mockCamera, mockLayer);

        var firstCall = worldToTileXYSpy.mock.calls[0];
        expect(firstCall[0]).toBe(32);
        expect(firstCall[1]).toBe(64);
        expect(firstCall[2]).toBe(true);
    });

    it('should call WorldToTileXY second with snap=false for bottom-right corner', function ()
    {
        GetTilesWithinWorldXY(32, 64, 64, 64, mockFilteringOptions, mockCamera, mockLayer);

        var secondCall = worldToTileXYSpy.mock.calls[1];
        expect(secondCall[0]).toBe(32 + 64);
        expect(secondCall[1]).toBe(64 + 64);
        expect(secondCall[2]).toBe(false);
    });

    it('should pass the camera to WorldToTileXY calls', function ()
    {
        GetTilesWithinWorldXY(0, 0, 64, 64, mockFilteringOptions, mockCamera, mockLayer);

        expect(worldToTileXYSpy.mock.calls[0][4]).toBe(mockCamera);
        expect(worldToTileXYSpy.mock.calls[1][4]).toBe(mockCamera);
    });

    it('should pass the layer to WorldToTileXY calls', function ()
    {
        GetTilesWithinWorldXY(0, 0, 64, 64, mockFilteringOptions, mockCamera, mockLayer);

        expect(worldToTileXYSpy.mock.calls[0][5]).toBe(mockLayer);
        expect(worldToTileXYSpy.mock.calls[1][5]).toBe(mockLayer);
    });

    it('should return an array', function ()
    {
        var result = GetTilesWithinWorldXY(0, 0, 64, 64, mockFilteringOptions, mockCamera, mockLayer);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return tiles within the specified world area', function ()
    {
        // worldX=0, worldY=0, width=64, height=64 with tileSize=32
        // -> tile 0,0 to 2,2 => a 2x2 area of tiles
        var result = GetTilesWithinWorldXY(0, 0, 64, 64, mockFilteringOptions, mockCamera, mockLayer);

        expect(result.length).toBe(4);
    });

    it('should return a single tile for a single-tile-sized area', function ()
    {
        var result = GetTilesWithinWorldXY(0, 0, 32, 32, mockFilteringOptions, mockCamera, mockLayer);

        expect(result.length).toBe(1);
    });

    it('should return empty array when area has zero width', function ()
    {
        var result = GetTilesWithinWorldXY(0, 0, 0, 64, mockFilteringOptions, mockCamera, mockLayer);

        expect(result.length).toBe(0);
    });

    it('should return empty array when area has zero height', function ()
    {
        var result = GetTilesWithinWorldXY(0, 0, 64, 0, mockFilteringOptions, mockCamera, mockLayer);

        expect(result.length).toBe(0);
    });

    it('should pass worldX + width as x coordinate of second WorldToTileXY call', function ()
    {
        var worldX = 100;
        var worldY = 200;
        var width = 150;
        var height = 250;

        GetTilesWithinWorldXY(worldX, worldY, width, height, mockFilteringOptions, mockCamera, mockLayer);

        var secondCall = worldToTileXYSpy.mock.calls[1];
        expect(secondCall[0]).toBe(worldX + width);
        expect(secondCall[1]).toBe(worldY + height);
    });

    it('should ceil the bottom-right tile coordinate for partial tiles', function ()
    {
        // Set up mock where bottom-right returns a fractional tile position
        worldToTileXYSpy.mockImplementation(function (wx, wy, snap, point)
        {
            if (snap === true)
            {
                point.x = 1;
                point.y = 1;
            }
            else
            {
                // Fractional: ceil(1.1) = 2, ceil(1.1) = 2
                // So we expect a 1x1 area (2-1=1, 2-1=1)
                point.x = 1.1;
                point.y = 1.1;
            }
        });

        var result = GetTilesWithinWorldXY(32, 32, 35, 35, mockFilteringOptions, mockCamera, mockLayer);

        // xStart=1, yStart=1, xEnd=ceil(1.1)=2, yEnd=ceil(1.1)=2
        // width = 2-1 = 1, height = 2-1 = 1
        expect(result.length).toBe(1);
    });

    it('should include partial tiles on the right and bottom edges', function ()
    {
        // End coords land exactly on a tile boundary (no partial)
        worldToTileXYSpy.mockImplementation(function (wx, wy, snap, point)
        {
            if (snap === true)
            {
                point.x = 0;
                point.y = 0;
            }
            else
            {
                // Exactly 3.0 — ceil(3.0) = 3
                point.x = 3.0;
                point.y = 3.0;
            }
        });

        var result = GetTilesWithinWorldXY(0, 0, 96, 96, mockFilteringOptions, mockCamera, mockLayer);

        // width = ceil(3.0) - 0 = 3, height = 3
        expect(result.length).toBe(9);
    });

    it('should filter out empty tiles when isNotEmpty is set', function ()
    {
        mockLayer.data[0][0].index = -1;
        mockLayer.data[0][1].index = -1;

        var result = GetTilesWithinWorldXY(0, 0, 64, 32, { isNotEmpty: true }, mockCamera, mockLayer);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].index).not.toBe(-1);
        }
    });

    it('should filter tiles by collision when isColliding is set', function ()
    {
        mockLayer.data[0][0].collides = true;
        mockLayer.data[0][1].collides = false;

        var result = GetTilesWithinWorldXY(0, 0, 64, 32, { isColliding: true }, mockCamera, mockLayer);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].collides).toBe(true);
        }
    });

    it('should handle null tiles in layer data gracefully', function ()
    {
        mockLayer.data[0][0] = null;

        var result = GetTilesWithinWorldXY(0, 0, 64, 32, mockFilteringOptions, mockCamera, mockLayer);

        expect(Array.isArray(result)).toBe(true);
        // null tiles should not be included
        for (var i = 0; i < result.length; i++)
        {
            expect(result[i]).not.toBeNull();
        }
    });

    it('should clamp results to layer boundaries when area extends beyond layer', function ()
    {
        // Request tiles starting at tile 18,18 with a large area
        worldToTileXYSpy.mockImplementation(function (wx, wy, snap, point)
        {
            if (snap === true)
            {
                point.x = 18;
                point.y = 18;
            }
            else
            {
                point.x = 25;
                point.y = 25;
            }
        });

        var result = GetTilesWithinWorldXY(576, 576, 224, 224, mockFilteringOptions, mockCamera, mockLayer);

        // Layer is 20x20 tiles, so only tiles 18,18 to 19,19 should be returned
        expect(result.length).toBe(4);
    });

    it('should return tiles from correct tile coordinates derived from world coords', function ()
    {
        // Mark a specific tile so we can identify it in results
        mockLayer.data[2][3].index = 99;

        worldToTileXYSpy.mockImplementation(function (wx, wy, snap, point)
        {
            if (snap === true)
            {
                point.x = 3;
                point.y = 2;
            }
            else
            {
                point.x = 4;
                point.y = 3;
            }
        });

        var result = GetTilesWithinWorldXY(96, 64, 32, 32, mockFilteringOptions, mockCamera, mockLayer);

        expect(result.length).toBe(1);
        expect(result[0].index).toBe(99);
    });
});
