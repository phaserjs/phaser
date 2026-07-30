var RemoveTileAt = require('../../../src/tilemaps/components/RemoveTileAt');
var Tile = require('../../../src/tilemaps/Tile');

/**
 * Creates a plain tile-like object implementing the minimal interface
 * required by IsInLayerBounds, GetTileAt, CalculateFacesAt, and RemoveTileAt.
 */
function createTestTile (options)
{
    var tile = {
        index: 1,
        x: 0,
        y: 0,
        collides: false,
        faceTop: false,
        faceBottom: false,
        faceLeft: false,
        faceRight: false,
        resetFaces: function ()
        {
            this.faceTop = false;
            this.faceBottom = false;
            this.faceLeft = false;
            this.faceRight = false;
        }
    };

    if (options)
    {
        for (var key in options)
        {
            tile[key] = options[key];
        }
    }

    return tile;
}

function createLayer (width, height)
{
    var data = [];

    for (var row = 0; row < height; row++)
    {
        data[row] = [];

        for (var col = 0; col < width; col++)
        {
            data[row][col] = null;
        }
    }

    return {
        data: data,
        width: width,
        height: height,
        tileWidth: 32,
        tileHeight: 32
    };
}

describe('Phaser.Tilemaps.Components.RemoveTileAt', function ()
{
    describe('bounds checking', function ()
    {
        it('should return null when tile coordinates are out of layer bounds', function ()
        {
            var layer = createLayer(5, 5);
            layer.data[0][0] = createTestTile();

            // tileX = -1 is out of bounds — IsInLayerBounds returns false
            var result = RemoveTileAt(-1, 0, true, false, layer);

            expect(result).toBeNull();
        });

        it('should return the tile when coordinates are within bounds', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile();
            layer.data[2][3] = tile;

            var result = RemoveTileAt(3, 2, true, false, layer);

            expect(result).toBe(tile);
        });

        it('should not modify layer data when coordinates are out of bounds', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile();
            layer.data[0][0] = tile;

            RemoveTileAt(-1, 0, true, false, layer);

            expect(layer.data[0][0]).toBe(tile);
        });
    });

    describe('missing tile handling', function ()
    {
        it('should return null when the tile at the given coordinates is null', function ()
        {
            var layer = createLayer(5, 5);
            // data[1][1] is already null

            var result = RemoveTileAt(1, 1, true, false, layer);

            expect(result).toBeNull();
        });

        it('should return null when the tile at the given coordinates is undefined', function ()
        {
            var layer = createLayer(5, 5);
            layer.data[1][1] = undefined;

            var result = RemoveTileAt(1, 1, true, false, layer);

            expect(result).toBeNull();
        });

        it('should not recalculate faces when the tile slot is empty', function ()
        {
            var layer = createLayer(5, 5);
            var below = createTestTile({ collides: true });
            layer.data[1][0] = below;
            // data[0][0] is null — nothing to remove

            RemoveTileAt(0, 0, true, true, layer);

            // CalculateFacesAt was NOT called (no tile existed), so below is untouched
            expect(below.faceTop).toBe(false);
        });
    });

    describe('tile removal and replacement', function ()
    {
        it('should return the removed tile object', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile();
            layer.data[0][0] = tile;

            var result = RemoveTileAt(0, 0, true, false, layer);

            expect(result).toBe(tile);
        });

        it('should replace the tile with null when replaceWithNull is true', function ()
        {
            var layer = createLayer(5, 5);
            layer.data[2][2] = createTestTile();

            RemoveTileAt(2, 2, true, false, layer);

            expect(layer.data[2][2]).toBeNull();
        });

        it('should replace the tile with a new Tile instance when replaceWithNull is false', function ()
        {
            var layer = createLayer(5, 5);
            layer.data[1][1] = createTestTile();

            RemoveTileAt(1, 1, false, false, layer);

            expect(layer.data[1][1]).toBeInstanceOf(Tile);
        });

        it('should create the replacement Tile with index -1', function ()
        {
            var layer = createLayer(5, 5);
            layer.data[0][0] = createTestTile();

            RemoveTileAt(0, 0, false, false, layer);

            expect(layer.data[0][0].index).toBe(-1);
        });

        it('should pass correct tileX and tileY to the replacement Tile constructor', function ()
        {
            var layer = createLayer(5, 5);
            layer.data[4][3] = createTestTile();

            RemoveTileAt(3, 4, false, false, layer);

            expect(layer.data[4][3].x).toBe(3);
            expect(layer.data[4][3].y).toBe(4);
        });

        it('should pass layer tileWidth and tileHeight to the replacement Tile', function ()
        {
            var layer = createLayer(5, 5);
            layer.data[0][0] = createTestTile();
            layer.tileWidth = 64;
            layer.tileHeight = 48;

            RemoveTileAt(0, 0, false, false, layer);

            // Real Tile stores these as .width and .height
            expect(layer.data[0][0].width).toBe(64);
            expect(layer.data[0][0].height).toBe(48);
        });

        it('should only modify the tile at the specified coordinates', function ()
        {
            var layer = createLayer(5, 5);
            var tile0 = createTestTile();
            var tile1 = createTestTile();
            layer.data[0][0] = tile0;
            layer.data[1][1] = tile1;

            RemoveTileAt(0, 0, true, false, layer);

            expect(layer.data[0][0]).toBeNull();
            expect(layer.data[1][1]).toBe(tile1);
        });
    });

    describe('default parameter values', function ()
    {
        it('should default replaceWithNull to true when not specified', function ()
        {
            var layer = createLayer(5, 5);
            layer.data[0][0] = createTestTile();

            RemoveTileAt(0, 0, undefined, false, layer);

            expect(layer.data[0][0]).toBeNull();
        });

        it('should default recalculateFaces to true when not specified', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile({ collides: true });
            layer.data[0][0] = tile;
            var below = createTestTile({ collides: true });
            layer.data[1][0] = below;

            // recalculateFaces defaults to true — CalculateFacesAt should run
            RemoveTileAt(0, 0, true, undefined, layer);

            expect(below.faceTop).toBe(true);
        });
    });

    describe('face recalculation', function ()
    {
        it('should update neighbor faces when recalculateFaces is true and tile collides', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile({ collides: true });
            layer.data[1][0] = tile;
            var below = createTestTile({ collides: true });
            layer.data[2][0] = below;

            RemoveTileAt(0, 1, true, true, layer);

            // CalculateFacesAt ran: below's faceTop should be set to true
            expect(below.faceTop).toBe(true);
        });

        it('should not update neighbor faces when recalculateFaces is false', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile({ collides: true });
            layer.data[1][0] = tile;
            var below = createTestTile({ collides: true });
            layer.data[2][0] = below;

            RemoveTileAt(0, 1, true, false, layer);

            expect(below.faceTop).toBe(false);
        });

        it('should not update neighbor faces when the tile does not collide', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile({ collides: false });
            layer.data[1][0] = tile;
            var below = createTestTile({ collides: true });
            layer.data[2][0] = below;

            RemoveTileAt(0, 1, true, true, layer);

            expect(below.faceTop).toBe(false);
        });

        it('should not update neighbor faces when recalculateFaces is false even if tile collides', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile({ collides: true });
            layer.data[0][0] = tile;
            var below = createTestTile({ collides: true });
            layer.data[1][0] = below;

            RemoveTileAt(0, 0, true, false, layer);

            expect(below.faceTop).toBe(false);
        });

        it('should update the correct neighbor for the given coordinates', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile({ collides: true });
            layer.data[3][3] = tile;
            var below = createTestTile({ collides: true });
            layer.data[4][3] = below;

            RemoveTileAt(3, 3, true, true, layer);

            expect(below.faceTop).toBe(true);
        });

        it('should still return the tile even when face recalculation occurs', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile({ collides: true });
            layer.data[0][0] = tile;

            var result = RemoveTileAt(0, 0, true, true, layer);

            expect(result).toBe(tile);
        });
    });

    describe('coordinate variations', function ()
    {
        it('should work at the origin (0, 0)', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile();
            layer.data[0][0] = tile;

            var result = RemoveTileAt(0, 0, true, false, layer);

            expect(result).toBe(tile);
            expect(layer.data[0][0]).toBeNull();
        });

        it('should work at non-zero coordinates', function ()
        {
            var layer = createLayer(5, 5);
            var tile = createTestTile();
            layer.data[4][3] = tile;

            var result = RemoveTileAt(3, 4, true, false, layer);

            expect(result).toBe(tile);
            expect(layer.data[4][3]).toBeNull();
        });
    });
});
