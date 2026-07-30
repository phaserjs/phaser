var PutTileAtWorldXY = require('../../../src/tilemaps/components/PutTileAtWorldXY');

function makeTileObj (index)
{
    return {
        index: (index !== undefined) ? index : 0,
        collides: false,
        width: 32,
        height: 32,
        setCollision: function () {},
        resetCollision: function () {}
    };
}

function makeLayer (options)
{
    options = options || {};

    var tileWidth = options.tileWidth || 32;
    var tileHeight = options.tileHeight || 32;
    var numCols = options.numCols || 3;
    var numRows = options.numRows || 3;

    var data = options.data;

    if (!data)
    {
        data = [];

        for (var r = 0; r < numRows; r++)
        {
            data.push([]);

            for (var c = 0; c < numCols; c++)
            {
                data[r].push(makeTileObj(0));
            }
        }
    }

    // tiles[index][2] = tilesetId — cover indices 0-19
    var tiles = [];

    for (var i = 0; i < 20; i++)
    {
        tiles.push([ i, 0, 0 ]);
    }

    var worldToTileXY = options.worldToTileXY || vi.fn(function (worldX, worldY, snapToFloor, point)
    {
        point.x = Math.floor(worldX / tileWidth);
        point.y = Math.floor(worldY / tileHeight);
    });

    return {
        data: data,
        width: options.width !== undefined ? options.width : numCols,
        height: options.height !== undefined ? options.height : numRows,
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        collideIndexes: options.collideIndexes || [],
        tilemapLayer: {
            worldToTileXY: worldToTileXY,
            tilemap: {
                tiles: tiles,
                tilesets: [ { tileWidth: tileWidth, tileHeight: tileHeight } ]
            }
        }
    };
}

describe('Phaser.Tilemaps.Components.PutTileAtWorldXY', function ()
{
    beforeEach(function ()
    {
        vi.clearAllMocks();
    });

    it('should call worldToTileXY with the given world coordinates', function ()
    {
        var layer = makeLayer();

        PutTileAtWorldXY(1, 64, 96, false, null, layer);

        expect(layer.tilemapLayer.worldToTileXY).toHaveBeenCalledOnce();
        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[0]).toBe(64);
        expect(call[1]).toBe(96);
    });

    it('should always pass snapToFloor as true to worldToTileXY', function ()
    {
        var layer = makeLayer();

        PutTileAtWorldXY(1, 64, 96, false, null, layer);

        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[2]).toBe(true);
    });

    it('should pass the camera argument to worldToTileXY', function ()
    {
        var layer = makeLayer();
        var camera = { scrollX: 100, scrollY: 50 };

        PutTileAtWorldXY(1, 64, 96, false, camera, layer);

        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[4]).toBe(camera);
    });

    it('should pass a Vector2-like point object to worldToTileXY', function ()
    {
        var layer = makeLayer();

        PutTileAtWorldXY(1, 0, 0, false, null, layer);

        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        var point = call[3];
        expect(point).toBeDefined();
        expect(typeof point.x).toBe('number');
        expect(typeof point.y).toBe('number');
    });

    it('should use the converted tile coordinates to place the tile', function ()
    {
        // world (32, 0) with 32px tiles -> tile (1, 0)
        var data = [
            [ makeTileObj(0), makeTileObj(0) ]
        ];
        var layer = makeLayer({ data: data });

        PutTileAtWorldXY(5, 32, 0, false, null, layer);

        expect(data[0][1].index).toBe(5);
    });

    it('should return the tile object placed by PutTileAt', function ()
    {
        var layer = makeLayer();
        var originalTile = layer.data[0][0];

        var result = PutTileAtWorldXY(2, 0, 0, false, null, layer);

        expect(result).toBe(originalTile);
    });

    it('should return null when worldToTileXY converts to out-of-bounds tile coordinates', function ()
    {
        // 3x3 layer; world (9999, 9999) -> tile (~312, ~312) which is outside bounds
        var layer = makeLayer();

        var result = PutTileAtWorldXY(1, 9999, 9999, false, null, layer);

        expect(result).toBeNull();
    });

    it('should work with zero world coordinates', function ()
    {
        var layer = makeLayer();

        PutTileAtWorldXY(1, 0, 0, false, null, layer);

        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[0]).toBe(0);
        expect(call[1]).toBe(0);
    });

    it('should work with negative world coordinates', function ()
    {
        var layer = makeLayer();

        PutTileAtWorldXY(1, -64, -128, false, null, layer);

        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[0]).toBe(-64);
        expect(call[1]).toBe(-128);
    });

    it('should work with floating point world coordinates', function ()
    {
        var layer = makeLayer();

        PutTileAtWorldXY(1, 12.5, 37.8, false, null, layer);

        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[0]).toBeCloseTo(12.5);
        expect(call[1]).toBeCloseTo(37.8);
    });

    it('should work with a null camera', function ()
    {
        var layer = makeLayer();

        expect(function ()
        {
            PutTileAtWorldXY(1, 0, 0, false, null, layer);
        }).not.toThrow();

        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[4]).toBeNull();
    });

    it('should reuse the same shared point object across multiple calls', function ()
    {
        var data = [
            [ makeTileObj(0), makeTileObj(0) ],
            [ makeTileObj(0), makeTileObj(0) ]
        ];
        var layer = makeLayer({ data: data });

        PutTileAtWorldXY(1, 0, 0, false, null, layer);
        PutTileAtWorldXY(2, 32, 0, false, null, layer);

        var point1 = layer.tilemapLayer.worldToTileXY.mock.calls[0][3];
        var point2 = layer.tilemapLayer.worldToTileXY.mock.calls[1][3];
        expect(point1).toBe(point2);
    });

    it('should pass the layer to worldToTileXY as the sixth argument', function ()
    {
        var layer = makeLayer();

        PutTileAtWorldXY(1, 0, 0, false, null, layer);

        var call = layer.tilemapLayer.worldToTileXY.mock.calls[0];
        expect(call[5]).toBe(layer);
    });

    it('should correctly place a tile at coordinates derived from world position', function ()
    {
        var data = [
            [ makeTileObj(0), makeTileObj(0), makeTileObj(0) ],
            [ makeTileObj(0), makeTileObj(0), makeTileObj(0) ],
            [ makeTileObj(0), makeTileObj(0), makeTileObj(0) ]
        ];
        var layer = makeLayer({ data: data });

        // world (64, 32) with default 32px tiles -> tile (2, 1)
        PutTileAtWorldXY(7, 64, 32, false, null, layer);

        expect(data[1][2].index).toBe(7);
    });

    it('should accept a numeric tile index', function ()
    {
        var layer = makeLayer();

        var result = PutTileAtWorldXY(3, 0, 0, false, null, layer);

        expect(result.index).toBe(3);
    });
});
